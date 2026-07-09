import { test } from "bun:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import {
  alphaDownloadBaseURL,
  alphaVersionURL,
  downloadFile,
  installMihomo,
  mihomoPackageName,
  mihomoPackageURL,
  releaseDownloadBaseURL,
  releaseVersionURL,
  resolveMihomoVersion,
} from "../lib/mihomo.mjs";

async function withCustomGitHubToken(token, fn) {
  const original = process.env.CUSTOM_GITHUB_TOKEN;
  process.env.CUSTOM_GITHUB_TOKEN = token;
  try {
    return await fn();
  } finally {
    if (original === undefined) {
      delete process.env.CUSTOM_GITHUB_TOKEN;
    } else {
      process.env.CUSTOM_GITHUB_TOKEN = original;
    }
  }
}

test("constructs release package URLs", () => {
  assert.equal(
    mihomoPackageName({ channel: "release", version: "v1.2.3", platform: "linux", arch: "x64" }),
    "mihomo-linux-amd64-v1-v1.2.3.gz",
  );
  assert.equal(
    mihomoPackageURL({ channel: "release", version: "v1.2.3", platform: "linux", arch: "x64" }),
    `${releaseDownloadBaseURL}v1.2.3/mihomo-linux-amd64-v1-v1.2.3.gz`,
  );
});

test("constructs Alpha package URLs", () => {
  assert.equal(
    mihomoPackageName({ channel: "alpha", version: "alpha-abc123", platform: "linux", arch: "x64" }),
    "mihomo-linux-amd64-v1-alpha-abc123.gz",
  );
  assert.equal(
    mihomoPackageURL({ channel: "alpha", version: "alpha-abc123", platform: "linux", arch: "x64" }),
    `${alphaDownloadBaseURL}mihomo-linux-amd64-v1-alpha-abc123.gz`,
  );
});

test("constructs macOS, Windows, and android package names", () => {
  assert.equal(
    mihomoPackageName({ channel: "release", version: "v1.2.3", platform: "darwin", arch: "arm64" }),
    "mihomo-darwin-arm64-v1.2.3.gz",
  );
  assert.equal(
    mihomoPackageName({ channel: "release", version: "v1.2.3", platform: "win32", arch: "x64" }),
    "mihomo-windows-amd64-v1-v1.2.3.zip",
  );
  assert.equal(
    mihomoPackageName({ channel: "release", version: "v1.2.3", platform: "android", arch: "arm64" }),
    "mihomo-android-arm64-v8-v1.2.3.gz",
  );
});

test("returns binary override without network access", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "mihomo-override-"));
  const binary = path.join(dir, "mihomo");
  await fs.writeFile(binary, "");
  try {
    const resolved = await installMihomo({
      binaryOverride: binary,
      fetchImpl: async () => {
        throw new Error("network should not be used");
      },
    });
    assert.equal(resolved, binary);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test("downloads latest release asset by channel", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "mihomo-release-"));
  const archive = zlib.gzipSync("binary");
  const calls = [];

  try {
    const resolved = await installMihomo({
      cacheRoot: dir,
      channel: "release",
      platform: "linux",
      arch: "x64",
      fetchImpl: async (url) => {
        calls.push(String(url));
        if (url === releaseVersionURL) {
          return new Response("v1.2.3\n");
        }
        if (url === `${releaseDownloadBaseURL}v1.2.3/mihomo-linux-amd64-v1-v1.2.3.gz`) {
          return new Response(archive);
        }
        return new Response("missing", { status: 404 });
      },
    });

    assert.equal(resolved, path.join(dir, "mihomo-release", "v1.2.3", "mihomo-linux-amd64-v1"));
    assert.equal(await fs.readFile(resolved, "utf8"), "binary");
    assert.deepEqual(calls, [
      releaseVersionURL,
      `${releaseDownloadBaseURL}v1.2.3/mihomo-linux-amd64-v1-v1.2.3.gz`,
    ]);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test("downloads Alpha asset by channel", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "mihomo-alpha-"));
  const archive = zlib.gzipSync("binary");
  const calls = [];

  try {
    const resolved = await installMihomo({
      cacheRoot: dir,
      channel: "alpha",
      platform: "linux",
      arch: "x64",
      fetchImpl: async (url) => {
        calls.push(String(url));
        if (url === alphaVersionURL) {
          return new Response("alpha-abc123\n");
        }
        if (url === `${alphaDownloadBaseURL}mihomo-linux-amd64-v1-alpha-abc123.gz`) {
          return new Response(archive);
        }
        return new Response("missing", { status: 404 });
      },
    });

    assert.equal(resolved, path.join(dir, "mihomo-alpha", "alpha-abc123", "mihomo-linux-amd64-v1"));
    assert.equal(await fs.readFile(resolved, "utf8"), "binary");
    assert.deepEqual(calls, [
      alphaVersionURL,
      `${alphaDownloadBaseURL}mihomo-linux-amd64-v1-alpha-abc123.gz`,
    ]);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test("reports version request failures", async () => {
  await assert.rejects(
    () =>
      resolveMihomoVersion({
        channel: "release",
        fetchImpl: async () => new Response("missing", { status: 404 }),
      }),
    /failed to fetch Mihomo release version: HTTP 404/,
  );
});

test("rejects unsupported channels", () => {
  assert.throws(
    () => mihomoPackageURL({ channel: "nightly", version: "v1.2.3" }),
    /mihomo channel must be one of release, alpha/,
  );
});

test("fails when package exceeds size limit", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "mihomo-download-"));
  try {
    await assert.rejects(
      () =>
        downloadFile({
          url: "https://example.com/mihomo.gz",
          targetPath: path.join(dir, "mihomo.gz"),
          maxBytes: 3,
          fetchImpl: async () => new Response("1234"),
        }),
      /exceeded 3 bytes/,
    );
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test("adds custom GitHub token to Mihomo GitHub requests", async () => {
  await withCustomGitHubToken("test-token", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "mihomo-token-"));
    try {
      await downloadFile({
        url: `${releaseDownloadBaseURL}v1.2.3/mihomo-linux-amd64-v1-v1.2.3.gz`,
        targetPath: path.join(dir, "mihomo.gz"),
        fetchImpl: async (url, options) => {
          assert.equal(
            url,
            `${releaseDownloadBaseURL}v1.2.3/mihomo-linux-amd64-v1-v1.2.3.gz`,
          );
          assert.deepEqual(options, {
            headers: {
              Authorization: "Bearer test-token",
            },
          });
          return new Response("binary");
        },
      });
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });
});
