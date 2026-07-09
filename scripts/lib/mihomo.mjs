import fs from "node:fs/promises";
import { createWriteStream, createReadStream } from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import zlib from "node:zlib";
import extractZip from "extract-zip";
import { githubFetchOptions } from "./github.mjs";

export const releaseDownloadBaseURL = "https://github.com/MetaCubeX/mihomo/releases/download/";
export const releaseVersionURL = "https://github.com/MetaCubeX/mihomo/releases/latest/download/version.txt";
export const alphaDownloadBaseURL = "https://github.com/MetaCubeX/mihomo/releases/download/Prerelease-Alpha/";
export const alphaVersionURL = "https://github.com/MetaCubeX/mihomo/releases/download/Prerelease-Alpha/version.txt";
export const defaultMihomoChannel = "release";
export const maxPackageFileSize = 32 * 1024 * 1024;

const channelConfigs = {
  release: {
    label: "release",
    cacheName: "mihomo-release",
    versionURL: releaseVersionURL,
    packageURL: ({ version, packageName }) => `${releaseDownloadBaseURL}${version}/${packageName}`,
  },
  alpha: {
    label: "Alpha",
    cacheName: "mihomo-alpha",
    versionURL: alphaVersionURL,
    packageURL: ({ packageName }) => `${alphaDownloadBaseURL}${packageName}`,
  },
};

export class MihomoDownloadError extends Error {
  constructor(message) {
    super(message);
    this.name = "MihomoDownloadError";
  }
}

export function normalizeMihomoChannel(channel = defaultMihomoChannel) {
  const normalized = String(channel).trim().toLowerCase();
  if (normalized in channelConfigs) return normalized;
  throw new MihomoDownloadError("mihomo channel must be one of release, alpha");
}

export function platformToGoos(platform = process.platform) {
  return platform === "win32" ? "windows" : platform;
}

export function archToGoarch(arch = process.arch) {
  switch (arch) {
    case "x64":
      return "amd64";
    case "ia32":
      return "386";
    default:
      return arch;
  }
}

export function coreBaseName({
  platform = process.platform,
  arch = process.arch,
  goamd64 = process.env.GOAMD64 || "v1",
  goarm = process.env.GOARM || "v7",
  gomips = process.env.GOMIPS || "hardfloat",
} = {}) {
  const goos = platformToGoos(platform);
  const goarch = archToGoarch(arch);
  switch (goarch) {
    case "arm":
      return `mihomo-${goos}-${goarch}v${goarm}`;
    case "arm64":
      return goos === "android" ? `mihomo-${goos}-${goarch}-v8` : `mihomo-${goos}-${goarch}`;
    case "mips":
    case "mipsle":
      return `mihomo-${goos}-${goarch}-${gomips}`;
    case "amd64":
      return `mihomo-${goos}-${goarch}-${goamd64}`;
    default:
      return `mihomo-${goos}-${goarch}`;
  }
}

export function executableName(options = {}) {
  const baseName = coreBaseName(options);
  return platformToGoos(options.platform) === "windows" ? `${baseName}.exe` : baseName;
}

export function mihomoPackageName({
  channel = defaultMihomoChannel,
  version,
  platform = process.platform,
  arch = process.arch,
  ...rest
}) {
  normalizeMihomoChannel(channel);
  if (!version) throw new MihomoDownloadError("Mihomo version is required");
  const baseName = coreBaseName({ platform, arch, ...rest });
  const extension = platformToGoos(platform) === "windows" ? ".zip" : ".gz";
  return `${baseName}-${version}${extension}`;
}

export function mihomoPackageURL(options) {
  const channel = normalizeMihomoChannel(options?.channel);
  const version = options?.version;
  if (!version) throw new MihomoDownloadError("Mihomo version is required");
  const packageName = mihomoPackageName({ ...options, channel, version });
  return channelConfigs[channel].packageURL({ version, packageName });
}

export async function resolveMihomoVersion({ channel = defaultMihomoChannel, fetchImpl = fetch } = {}) {
  const normalizedChannel = normalizeMihomoChannel(channel);
  const config = channelConfigs[normalizedChannel];
  let response;
  try {
    response = await fetchImpl(config.versionURL, githubFetchOptions(config.versionURL));
  } catch (error) {
    throw new MihomoDownloadError(`failed to fetch Mihomo ${config.label} version: ${error.message}`);
  }
  if (!response.ok) {
    throw new MihomoDownloadError(`failed to fetch Mihomo ${config.label} version: HTTP ${response.status}`);
  }
  const version = (await response.text()).trim();
  if (!version) throw new MihomoDownloadError(`Mihomo ${config.label} version response was empty`);
  return version;
}

export async function downloadFile({ url, targetPath, fetchImpl = fetch, maxBytes = maxPackageFileSize }) {
  let response;
  try {
    response = await fetchImpl(url, githubFetchOptions(url));
  } catch (error) {
    throw new MihomoDownloadError(`failed to download Mihomo package: ${error.message}`);
  }
  if (!response.ok) {
    throw new MihomoDownloadError(`failed to download Mihomo package: HTTP ${response.status}`);
  }
  if (!response.body) throw new MihomoDownloadError("Mihomo package response had no body");

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  const body = Readable.fromWeb(response.body);
  let bytes = 0;
  const limited = async function* () {
    for await (const chunk of body) {
      bytes += chunk.byteLength;
      if (bytes > maxBytes) {
        throw new MihomoDownloadError(`Mihomo package exceeded ${maxBytes} bytes`);
      }
      yield chunk;
    }
  };
  await pipeline(Readable.from(limited()), createWriteStream(targetPath, { mode: 0o755 }));
}

export async function unpackPackage({ packagePath, outDir, outputName, mode = 0o755 }) {
  await fs.mkdir(outDir, { recursive: true });
  if (packagePath.endsWith(".gz")) {
    if (!outputName) throw new MihomoDownloadError("outputName is required for Mihomo gzip packages");
    const outputPath = path.join(outDir, outputName);
    await pipeline(createReadStream(packagePath), zlib.createGunzip(), createWriteStream(outputPath, { mode }));
    await fs.chmod(outputPath, mode);
    return outputPath;
  }
  if (packagePath.endsWith(".zip")) {
    await extractZip(packagePath, { dir: outDir });
    const files = await fs.readdir(outDir);
    const candidate = files.find((file) => file.startsWith("mihomo-") && (file.endsWith(".exe") || !file.includes(".")));
    if (!candidate) throw new MihomoDownloadError("could not find Mihomo executable in zip package");
    const outputPath = path.join(outDir, candidate);
    await fs.chmod(outputPath, mode);
    return outputPath;
  }
  throw new MihomoDownloadError("unsupported Mihomo package extension");
}

export async function installMihomo({
  cacheRoot = path.resolve(".tools"),
  cacheDir,
  channel = defaultMihomoChannel,
  fetchImpl = fetch,
  platform = process.platform,
  arch = process.arch,
  binaryOverride = process.env.MIHOMO_BINARY,
} = {}) {
  if (binaryOverride) {
    await fs.access(binaryOverride);
    return path.resolve(binaryOverride);
  }

  const normalizedChannel = normalizeMihomoChannel(channel);
  const config = channelConfigs[normalizedChannel];
  const resolvedCacheDir = cacheDir ?? path.join(cacheRoot, config.cacheName);
  const version = await resolveMihomoVersion({ channel: normalizedChannel, fetchImpl });
  const packageName = mihomoPackageName({ channel: normalizedChannel, version, platform, arch });
  const binaryDir = path.join(resolvedCacheDir, version);
  const packagePath = path.join(binaryDir, packageName);
  const expectedExecutable = path.join(binaryDir, executableName({ platform, arch }));

  try {
    await fs.access(expectedExecutable);
    return expectedExecutable;
  } catch {
    // Continue with download and extraction.
  }

  await downloadFile({
    url: mihomoPackageURL({ channel: normalizedChannel, version, platform, arch }),
    targetPath: packagePath,
    fetchImpl,
  });
  const unpackedPath = await unpackPackage({
    packagePath,
    outDir: binaryDir,
    outputName: path.basename(expectedExecutable),
  });
  if (path.basename(unpackedPath) !== path.basename(expectedExecutable)) {
    const normalizedPath = expectedExecutable;
    await fs.rename(unpackedPath, normalizedPath);
    return normalizedPath;
  }
  return unpackedPath;
}
