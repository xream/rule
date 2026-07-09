import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import YAML from "yaml";
import { enabledFiles, loadAllSources } from "./config.mjs";
import { githubFetchOptions } from "./github.mjs";
import { renderReleaseReadme } from "./links.mjs";
import { installMihomo } from "./mihomo.mjs";
import { rulesToYaml, splitRules } from "./rules.mjs";

const execFileAsync = promisify(execFile);
const SAFE_PROJECT_RESET_DIRS = new Set([".release", ".release-work"]);
const PLACEHOLDER_RULES = {
  domain: ["blackhole.invalid"],
  ipcidr: ["203.0.113.1/32"],
  remaining: ["DOMAIN,blackhole.invalid"],
};
const PLACEHOLDER_MESSAGES = {
  domain:
    "upstream currently has no domain rules; contains blackhole.invalid only",
  ipcidr:
    "upstream currently has no ipcidr rules; contains 203.0.113.1/32 only",
  remaining:
    "upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only",
};

export class BuildReleaseError extends Error {
  constructor(message, context = {}) {
    const location = [context.sourceName, context.entryName].filter(Boolean).join(":");
    super(location ? `${location}: ${message}` : message);
    this.name = "BuildReleaseError";
    this.context = context;
  }
}

export async function buildRelease({
  projectRoot = process.cwd(),
  sourceRoot = path.join(projectRoot, "source"),
  outputRoot = path.join(projectRoot, ".release"),
  workRoot = path.join(projectRoot, ".release-work"),
  repository = process.env.GITHUB_REPOSITORY,
  mainBranch = "main",
  releaseBranch = "release",
  mihomoPath,
  mihomoChannel = "release",
  fetchImpl = fetch,
  warn = (message) => console.warn(message),
} = {}) {
  const buildPaths = resolveBuildPaths({ projectRoot, sourceRoot, outputRoot, workRoot });
  validateResetPaths(buildPaths);
  ({ projectRoot, sourceRoot, outputRoot, workRoot } = buildPaths);

  await resetDir(outputRoot);
  await resetDir(workRoot);

  const sourceConfigs = await loadAllSources({ projectRoot, sourceRoot });
  const allArtifacts = [];
  let resolvedMihomoPath = mihomoPath;

  const getMihomoPath = async () => {
    if (!resolvedMihomoPath) {
      resolvedMihomoPath = await installMihomo({
        cacheRoot: path.join(projectRoot, ".tools"),
        channel: mihomoChannel,
        fetchImpl,
      });
    }
    return resolvedMihomoPath;
  };

  for (const sourceConfig of sourceConfigs) {
    const dirArtifacts = [];
    for (const group of groupedEntries(sourceConfig, { warn })) {
      const artifacts = await processGroup({
        group,
        outputRoot,
        workRoot,
        fetchImpl,
        getMihomoPath,
        warn,
      });
      dirArtifacts.push(...artifacts);
      allArtifacts.push(...artifacts);
    }

    if (dirArtifacts.length > 0) {
      const readme = renderReleaseReadme({
        sourceConfig,
        artifacts: allArtifacts,
        repository,
        mainBranch,
        releaseBranch,
      });
      const readmePath = path.join(outputRoot, sourceConfig.sourceRelativeDir, "README.md");
      await fs.mkdir(path.dirname(readmePath), { recursive: true });
      await fs.writeFile(readmePath, readme);
      const readmeArtifact = makeArtifact({
        entry: { slug: "README", name: "README", sourceRelativeDir: sourceConfig.sourceRelativeDir },
        outputRoot,
        filePath: readmePath,
        kind: "readme",
        label: `${sourceConfig.sourceName} README`,
      });
      allArtifacts.push(readmeArtifact);
    }
  }

  const manifestPath = await writeArtifactManifest({
    outputRoot,
    artifacts: allArtifacts,
  });
  allArtifacts.push(
    makeArtifact({
      entry: {
        slug: "artifacts-manifest",
        name: "artifacts-manifest",
        sourceRelativeDir: "",
      },
      outputRoot,
      filePath: manifestPath,
      kind: "manifest",
      label: "release artifact manifest",
    }),
  );

  return { outputRoot, artifacts: allArtifacts, sourceConfigs };
}

function resolveBuildPaths({ projectRoot, sourceRoot, outputRoot, workRoot }) {
  return {
    projectRoot: path.resolve(projectRoot),
    sourceRoot: path.resolve(sourceRoot),
    outputRoot: path.resolve(outputRoot),
    workRoot: path.resolve(workRoot),
  };
}

function validateResetPaths({ projectRoot, sourceRoot, outputRoot, workRoot }) {
  for (const [name, targetPath] of [
    ["outputRoot", outputRoot],
    ["workRoot", workRoot],
  ]) {
    if (samePath(targetPath, projectRoot)) {
      throw new BuildReleaseError(`${name} must not be the project root`);
    }
    if (pathsOverlap(targetPath, sourceRoot)) {
      throw new BuildReleaseError(`${name} must not overlap sourceRoot`);
    }
    if (isInsidePath(projectRoot, targetPath) && !isSafeProjectResetPath(projectRoot, targetPath)) {
      throw new BuildReleaseError(`${name} inside projectRoot must be under .release or .release-work`);
    }
  }

  if (pathsOverlap(outputRoot, workRoot)) {
    throw new BuildReleaseError("outputRoot and workRoot must not overlap");
  }
}

function pathsOverlap(left, right) {
  return isInsidePath(left, right) || isInsidePath(right, left);
}

function samePath(left, right) {
  return path.relative(left, right) === "";
}

function isSafeProjectResetPath(projectRoot, targetPath) {
  const relative = path.relative(projectRoot, targetPath);
  const [firstPart] = relative.split(path.sep);
  return SAFE_PROJECT_RESET_DIRS.has(firstPart);
}

function isInsidePath(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function groupedEntries(sourceConfig, { warn } = {}) {
  const groups = new Map();
  const entries = [...enabledFiles(sourceConfig)];
  const fakeIpFilterConfigPaths = new Set(
    entries
      .filter((entry) => entry.mihomo === "fake-ip-filter")
      .map((entry) => entry.sourceYamlPath),
  );

  for (const entry of entries) {
    if (fakeIpFilterConfigPaths.has(entry.sourceYamlPath) && entry.mihomo !== "fake-ip-filter") {
      warnIgnoredMixedMihomoEntry(entry, warn);
      continue;
    }

    const key = entry.separate ? `${entry.sourceYamlPath}\0${entry.index}` : entry.sourceYamlPath;
    if (!groups.has(key)) {
      const name = entry.separate ? entry.name : entry.configBaseName;
      const slug = entry.separate ? entry.slug : entry.configSlug;
      groups.set(key, {
        entry: {
          name,
          slug,
          ruleGroupName: entry.configSlug,
          mihomo: entry.mihomo,
          sourceName: entry.sourceName,
          sourceRelativeDir: entry.sourceRelativeDir,
        },
        entries: [],
      });
    }
    groups.get(key).entries.push(entry);
  }
  return [...groups.values()];
}

function warnIgnoredMixedMihomoEntry(entry, warn) {
  warn?.(
    `[warn] ${entry.sourceName}:${entry.name}: ignored because ${entry.configFileName} contains mihomo: fake-ip-filter; non fake-ip-filter entries in that YAML are ignored.`,
  );
}

async function processGroup({ group, outputRoot, workRoot, fetchImpl, getMihomoPath, warn }) {
  const entryOutputDir = path.join(outputRoot, group.entry.sourceRelativeDir);
  const entryWorkDir = path.join(workRoot, group.entry.sourceRelativeDir, group.entry.slug);
  await fs.mkdir(entryOutputDir, { recursive: true });
  await fs.mkdir(entryWorkDir, { recursive: true });

  const artifacts = [];
  const buckets = {
    domain: makeRuleBucket(),
    ipcidr: makeRuleBucket(),
    remaining: makeRuleBucket(),
  };

  for (const entry of group.entries) {
    const context = { sourceName: entry.sourceName, entryName: entry.name };
    const raw = await resolveRawEntry(entry, fetchImpl);
    const originalPath = path.join(entryOutputDir, `${entry.originalArtifactSlug}.original${sourceExtension(entry)}`);
    await fs.writeFile(originalPath, raw);
    artifacts.push(
      makeArtifact({
        entry,
        outputRoot,
        filePath: originalPath,
        kind: "original",
        label: `${entry.name} original`,
      }),
    );

    const split = entry.format === "mrs"
      ? await splitMrsEntry({ entry, originalPath, entryWorkDir, getMihomoPath, context })
      : splitRules({
          content: raw.toString("utf8"),
          format: entry.format,
          behavior: entry.behavior,
          context,
        });

    if (entry.mihomo === "fake-ip-filter") {
      addToRuleBucket(buckets.domain, split.domain, entry.sourceEntryKey);
      warnIgnoredFakeIpFilterRules({ entry, split, warn });
    } else {
      warnIgnoredUnsupportedRules({ entry, split, warn });
      addToRuleBucket(buckets.domain, split.domain, entry.sourceEntryKey);
      addToRuleBucket(buckets.ipcidr, split.ipcidr, entry.sourceEntryKey);
      addToRuleBucket(buckets.remaining, split.remaining, entry.sourceEntryKey);
    }
  }

  const allSourceEntryKeys = group.entries.map((entry) => entry.sourceEntryKey);

  if (group.entry.mihomo === "fake-ip-filter") {
    artifacts.push(
      ...(await convertRuleset({
        entry: group.entry,
        behavior: "domain",
        rules: placeholderRulesForEmptyBucket(buckets.domain, "domain"),
        entryOutputDir,
        entryWorkDir,
        outputRoot,
        getMihomoPath,
        sourceEntryKeys: sourceEntryKeysForBucket(buckets.domain, allSourceEntryKeys),
        placeholder: isPlaceholderBucket(buckets.domain),
        placeholderMessage: placeholderMessageForBucket(buckets.domain, "domain"),
      })),
    );
    return artifacts;
  }

  artifacts.push(
    ...(await convertRuleset({
      entry: group.entry,
      behavior: "domain",
      rules: placeholderRulesForEmptyBucket(buckets.domain, "domain"),
      entryOutputDir,
      entryWorkDir,
      outputRoot,
      getMihomoPath,
      sourceEntryKeys: sourceEntryKeysForBucket(buckets.domain, allSourceEntryKeys),
      placeholder: isPlaceholderBucket(buckets.domain),
      placeholderMessage: placeholderMessageForBucket(buckets.domain, "domain"),
    })),
  );
  artifacts.push(
    ...(await convertRuleset({
      entry: group.entry,
      behavior: "ipcidr",
      rules: placeholderRulesForEmptyBucket(buckets.ipcidr, "ipcidr"),
      entryOutputDir,
      entryWorkDir,
      outputRoot,
      getMihomoPath,
      sourceEntryKeys: sourceEntryKeysForBucket(buckets.ipcidr, allSourceEntryKeys),
      placeholder: isPlaceholderBucket(buckets.ipcidr),
      placeholderMessage: placeholderMessageForBucket(buckets.ipcidr, "ipcidr"),
    })),
  );

  const remainingRules = placeholderRulesForEmptyBucket(buckets.remaining, "remaining");
  const remainingPath = path.join(entryOutputDir, `${group.entry.slug}.yaml`);
  await fs.writeFile(remainingPath, rulesToYaml(remainingRules));
  artifacts.push(
    makeArtifact({
      entry: group.entry,
      outputRoot,
      filePath: remainingPath,
      kind: "remaining-yaml",
      label: `${group.entry.name} remaining yaml`,
      sourceEntryKeys: sourceEntryKeysForBucket(buckets.remaining, allSourceEntryKeys),
      placeholder: isPlaceholderBucket(buckets.remaining),
      placeholderMessage: placeholderMessageForBucket(buckets.remaining, "remaining"),
    }),
  );

  return artifacts;
}

function isPlaceholderBucket(bucket) {
  return bucket.rules.length === 0;
}

function placeholderRulesForEmptyBucket(bucket, kind) {
  return bucket.rules.length > 0 ? bucket.rules : PLACEHOLDER_RULES[kind];
}

function placeholderMessageForBucket(bucket, kind) {
  return bucket.rules.length === 0 ? PLACEHOLDER_MESSAGES[kind] : undefined;
}

function sourceEntryKeysForBucket(bucket, fallbackSourceEntryKeys) {
  return bucket.sourceEntryKeys.size > 0
    ? [...bucket.sourceEntryKeys]
    : fallbackSourceEntryKeys;
}

function warnIgnoredFakeIpFilterRules({ entry, split, warn }) {
  const ignored = [];
  if (split.ipcidr.length > 0) ignored.push(`${split.ipcidr.length} ipcidr`);
  if (split.remaining.length > 0) ignored.push(`${split.remaining.length} remaining`);
  if (split.unsupported?.length > 0) ignored.push(`${split.unsupported.length} unsupported`);
  if (ignored.length === 0) return;
  warn(
    `[warn] ${entry.sourceName}:${entry.name}: mihomo: fake-ip-filter only supports domain mrs; ignored ${ignored.join(", ")} rules.`,
  );
}

function warnIgnoredUnsupportedRules({ entry, split, warn }) {
  if (!split.unsupported?.length) return;
  const sample = split.unsupported.slice(0, 3).join("; ");
  const suffix = split.unsupported.length > 3 ? `; and ${split.unsupported.length - 3} more` : "";
  warn?.(
    `[warn] ${entry.sourceName}:${entry.name}: ignored unsupported rules for generated classical rule-provider: ${sample}${suffix}. MATCH, RULE-SET, and SUB-RULE cannot be used inside a classical rule-provider.`,
  );
}

async function writeArtifactManifest({ outputRoot, artifacts }) {
  const manifestPath = path.join(outputRoot, "artifacts-manifest.json");
  const providerArtifacts = artifacts
    .filter(isProviderManifestArtifact)
    .map((artifact) => ({
      relativePath: artifact.relativePath,
      sourceRelativeDir: artifact.sourceRelativeDir,
      entryName: artifact.entryName,
      fileName: artifact.fileName,
      kind: artifact.kind,
      mihomo: artifact.mihomo ?? "rules",
      ruleGroupName: artifact.ruleGroupName,
      placeholder: Boolean(artifact.placeholder),
    }))
    .sort((left, right) => left.relativePath.localeCompare(right.relativePath));
  await fs.writeFile(
    manifestPath,
    `${JSON.stringify({ version: 1, providerArtifacts }, null, 2)}\n`,
  );
  return manifestPath;
}

function isProviderManifestArtifact(artifact) {
  return ["domain-mrs", "ipcidr-mrs", "remaining-yaml"].includes(artifact.kind);
}

function makeRuleBucket() {
  return {
    rules: [],
    seen: new Set(),
    sourceEntryKeys: new Set(),
  };
}

function addToRuleBucket(bucket, rules, sourceEntryKey) {
  if (rules.length === 0) return;
  let added = false;
  for (const rule of rules) {
    if (bucket.seen.has(rule)) continue;
    bucket.seen.add(rule);
    bucket.rules.push(rule);
    added = true;
  }
  if (added) bucket.sourceEntryKeys.add(sourceEntryKey);
}

async function splitMrsEntry({ entry, originalPath, entryWorkDir, getMihomoPath, context }) {
  const textPath = path.join(entryWorkDir, `${entry.slug}.${entry.behavior}.from-mrs.txt`);
  await convertMrsToText({
    entry,
    behavior: entry.behavior,
    mrsPath: originalPath,
    outputPath: textPath,
    getMihomoPath,
  });
  return splitRules({
    content: await fs.readFile(textPath, "utf8"),
    format: "text",
    behavior: entry.behavior,
    context,
  });
}

async function resolveRawEntry(entry, fetchImpl) {
  const context = { sourceName: entry.sourceName, entryName: entry.name };
  if (entry.type === "http") {
    let response;
    try {
      response = await fetchImpl(entry.url, fetchOptions(entry));
    } catch (error) {
      throw new BuildReleaseError(`failed to fetch ${entry.url}: ${error.message}`, context);
    }
    if (!response.ok) {
      throw new BuildReleaseError(`failed to fetch ${entry.url}: HTTP ${response.status}`, context);
    }
    return Buffer.from(await response.arrayBuffer());
  }
  if (entry.type === "file") {
    try {
      return await fs.readFile(entry.resolvedPath);
    } catch (error) {
      throw new BuildReleaseError(`failed to read ${entry.path}: ${error.message}`, context);
    }
  }
  if (entry.type === "inline") {
    return Buffer.from(inlinePayloadToContent(entry), "utf8");
  }
  throw new BuildReleaseError(`unsupported source type ${entry.type}`, context);
}

function fetchOptions(entry) {
  return githubFetchOptions(
    entry.url,
    entry.headers ? { headers: entry.headers } : undefined,
  );
}

function inlinePayloadToContent(entry) {
  if (typeof entry.payload === "string") return ensureTrailingNewline(entry.payload);
  if (entry.format === "yaml") {
    if (Array.isArray(entry.payload)) return YAML.stringify({ payload: entry.payload });
    if (entry.payload && typeof entry.payload === "object") return YAML.stringify(entry.payload);
  }
  if (Array.isArray(entry.payload)) return `${entry.payload.join("\n")}\n`;
  return ensureTrailingNewline(String(entry.payload));
}

async function convertRuleset({
  entry,
  behavior,
  rules,
  entryOutputDir,
  entryWorkDir,
  outputRoot,
  getMihomoPath,
  sourceEntryKeys,
  placeholder = false,
  placeholderMessage,
}) {
  const sourcePath = path.join(entryWorkDir, `${entry.slug}.${behavior}.txt`);
  const artifactStem = rulesetArtifactStem(entry, behavior);
  const mrsPath = path.join(entryOutputDir, `${artifactStem}.mrs`);
  const txtPath = path.join(entryOutputDir, `${artifactStem}.txt`);
  await fs.writeFile(sourcePath, `${rules.join("\n")}\n`);

  await runMihomo({
    entry,
    args: ["convert-ruleset", behavior, "text", sourcePath, mrsPath],
    getMihomoPath,
  });
  const mrsArtifact = makeArtifact({
    entry,
    outputRoot,
    filePath: mrsPath,
    kind: `${behavior}-mrs`,
    label: `${entry.name} ${behavior} mrs`,
    sourceEntryKeys,
    placeholder,
    placeholderMessage,
  });
  const txtArtifact = await exportTextFromMrs({
    entry,
    behavior,
    mrsPath,
    outputPath: txtPath,
    outputRoot,
    getMihomoPath,
    sourceEntryKeys,
    placeholder,
    placeholderMessage,
  });
  return [mrsArtifact, txtArtifact];
}

async function exportTextFromMrs({
  entry,
  behavior,
  mrsPath,
  outputPath,
  outputRoot,
  getMihomoPath,
  sourceEntryKeys,
  placeholder = false,
  placeholderMessage,
}) {
  await convertMrsToText({
    entry,
    behavior,
    mrsPath,
    outputPath,
    getMihomoPath,
  });
  if (behavior === "ipcidr") {
    await rewriteIpcidrTextForViewing(outputPath);
  }
  return makeArtifact({
    entry,
    outputRoot,
    filePath: outputPath,
    kind: `${behavior}-txt`,
    label: `${entry.name} ${behavior} txt`,
    sourceEntryKeys,
    placeholder,
    placeholderMessage,
  });
}

async function rewriteIpcidrTextForViewing(outputPath) {
  const content = await fs.readFile(outputPath, "utf8");
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(ipcidrTextLineForViewing);
  await fs.writeFile(outputPath, lines.length > 0 ? `${lines.join("\n")}\n` : "");
}

function ipcidrTextLineForViewing(line) {
  if (/^IP-CIDR6?,/u.test(line)) return line;
  return `${line.includes(":") ? "IP-CIDR6" : "IP-CIDR"},${line}`;
}

async function convertMrsToText({ entry, behavior, mrsPath, outputPath, getMihomoPath }) {
  await runMihomo({
    entry,
    args: ["convert-ruleset", behavior, "mrs", mrsPath, outputPath],
    getMihomoPath,
  });
}

async function runMihomo({ entry, args, getMihomoPath }) {
  const context = { sourceName: entry.sourceName, entryName: entry.name };
  const mihomoPath = await getMihomoPath();
  try {
    await execFileAsync(mihomoPath, args, { maxBuffer: 1024 * 1024 * 8 });
  } catch (error) {
    const detail = [error.stderr, error.stdout, error.message].filter(Boolean).join("\n").trim();
    throw new BuildReleaseError(`mihomo conversion failed: ${detail}`, context);
  }
}

function makeArtifact({
  entry,
  outputRoot,
  filePath,
  kind,
  label,
  sourceEntryNames,
  sourceEntryKeys,
  placeholder = false,
  placeholderMessage,
}) {
  const relativePath = path.relative(outputRoot, filePath).split(path.sep).join("/");
  return {
    sourceRelativeDir: entry.sourceRelativeDir,
    entryName: entry.name,
    kind,
    label,
    fileName: path.basename(filePath),
    relativePath,
    absolutePath: filePath,
    sourceEntryNames,
    sourceEntryKey: entry.sourceEntryKey,
    sourceEntryKeys,
    placeholder,
    placeholderMessage,
    mihomo: entry.mihomo ?? "rules",
    ruleGroupName: entry.ruleGroupName,
  };
}

function sourceExtension(entry) {
  if (entry.path) {
    const ext = path.extname(entry.path);
    if (ext) return ext;
  }
  if (entry.url) {
    try {
      const ext = path.extname(new URL(entry.url).pathname);
      if (ext) return ext;
    } catch {
      // Fall through to format-based extension.
    }
  }
  if (entry.format === "text") return ".txt";
  if (entry.format === "mrs") return ".mrs";
  return ".yaml";
}

function rulesetArtifactStem(entry, behavior) {
  if (behavior === "domain") return appendArtifactSuffix(entry.slug, "Domain");
  if (behavior === "ipcidr") return appendArtifactSuffix(entry.slug, "IP");
  return entry.slug;
}

function appendArtifactSuffix(baseName, suffix) {
  if (baseName.endsWith(`_${suffix}`)) return baseName;
  if (suffix === "IP" && baseName.endsWith("_IPCIDR")) return `${baseName.slice(0, -"_IPCIDR".length)}_IP`;
  return `${baseName}_${suffix}`;
}

function ensureTrailingNewline(value) {
  return value.endsWith("\n") ? value : `${value}\n`;
}

async function resetDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}
