import { test } from "bun:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildRelease } from "../lib/artifacts.mjs";

async function withProject(files, fn) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "rule-build-"));
  for (const [relative, content] of Object.entries(files)) {
    const target = path.join(root, relative);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content);
  }
  const mihomoPath = await createMihomoStub(root);
  try {
    return await fn({
      root,
      mihomoPath,
      logPath: path.join(root, "mihomo.log"),
    });
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
}

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

async function createMihomoStub(root) {
  const stubPath = path.join(root, "mihomo-stub.cjs");
  await fs.writeFile(
    stubPath,
    `#!/usr/bin/env bun
const fs = require("fs");
const args = process.argv.slice(2);
fs.appendFileSync("${path.join(root, "mihomo.log").replaceAll("\\", "\\\\")}", args.join("|") + "\\n");
if (process.env.MIHOMO_STUB_FAIL === "1") process.exit(2);
const source = args[3];
const target = args[4];
if (args[2] === "mrs") {
  const content = fs.readFileSync(source, "utf8");
  fs.writeFileSync(target, args[1] === "ipcidr" ? content.replace(/^mrs:/, "") : content);
} else {
  fs.writeFileSync(target, "mrs:" + fs.readFileSync(source, "utf8"));
}
`,
  );
  await fs.chmod(stubPath, 0o755);
  return stubPath;
}

test("builds release artifacts from file source, split rules, and README", async () => {
  await withProject(
    {
      "source/example/local-rules.yaml": `
payload:
  - DOMAIN,example.com
  - DOMAIN-SUFFIX,example.org
  - "*"
  - mijia cloud
  - IP-CIDR,192.0.2.0/24
  - IP-CIDR6,2001:db8::/32
  - PROCESS-NAME,Example.app
`,
      "source/example/apple.yaml": `
- name: mixed-local
  description: Mixed fixture
  type: file
  path: local-rules.yaml
  behavior: classical
  format: yaml
- name: disabled
  description: Disabled fixture
  enabled: false
  type: http
  format: yaml
`,
    },
    async ({ root, mihomoPath, logPath }) => {
      const result = await buildRelease({
        projectRoot: root,
        repository: "xream/rule",
        mihomoPath,
      });
      const output = path.join(root, ".release", "example");
      assert.equal(
        result.artifacts.some(
          (artifact) =>
            artifact.relativePath === "example/mixed-local.original.yaml",
        ),
        true,
      );
      assert.equal(
        result.artifacts.some(
          (artifact) =>
            artifact.kind === "manifest" &&
            artifact.relativePath === "artifacts-manifest.json",
        ),
        true,
      );
      assert.equal(
        await fs.readFile(path.join(output, "apple_Domain.txt"), "utf8"),
        "mrs:example.com\n+.example.org\n*\nmijia cloud\n",
      );
      assert.equal(
        await fs.readFile(path.join(output, "apple_IP.txt"), "utf8"),
        "IP-CIDR,192.0.2.0/24\nIP-CIDR6,2001:db8::/32\n",
      );
      assert.equal(
        await fs.readFile(path.join(output, "apple.yaml"), "utf8"),
        "payload:\n  - PROCESS-NAME,Example.app\n",
      );
      const manifest = JSON.parse(
        await fs.readFile(path.join(root, ".release", "artifacts-manifest.json"), "utf8"),
      );
      assert.deepEqual(
        manifest.providerArtifacts
          .filter((artifact) => artifact.relativePath.startsWith("example/apple"))
          .map((artifact) => ({
            relativePath: artifact.relativePath,
            kind: artifact.kind,
            placeholder: artifact.placeholder,
          })),
        [
          {
            relativePath: "example/apple_Domain.mrs",
            kind: "domain-mrs",
            placeholder: false,
          },
          {
            relativePath: "example/apple_IP.mrs",
            kind: "ipcidr-mrs",
            placeholder: false,
          },
          {
            relativePath: "example/apple.yaml",
            kind: "remaining-yaml",
            placeholder: false,
          },
        ],
      );
      const readme = await fs.readFile(path.join(output, "README.md"), "utf8");
      assert.match(readme, /Source config: \[apple\.yaml\]/);
      assert.match(readme, /### mrs\(ipcidr\)/);
      assert.match(readme, /### mrs\(domain\)/);
      assert.match(readme, /### yaml\(remaining\)/);
      assert.doesNotMatch(readme, /剩余部分/);
      assert.match(readme, /apple_Domain\.mrs/);
      assert.match(readme, /Text: \[apple_Domain\.txt\]/);
      assert.match(readme, /apple\.yaml/);
      assert.match(readme, /Source: \[mixed-local\.original\.yaml\]/);
      assert.match(
        readme,
        /https:\/\/raw\.githubusercontent\.com\/xream\/rule\/release\/example\/apple_Domain\.mrs/,
      );
      assert.equal(
        readme.includes(`rules:
  - RULE-SET,apple_Domain,apple
  - RULE-SET,apple,apple,no-resolve
  - RULE-SET,apple_IP,apple,no-resolve
rule-anchor:`),
        true,
      );
      assert.match(
        readme,
        /apple_IP: \{ <<: \*ip, url: https:\/\/raw\.githubusercontent\.com\/xream\/rule\/release\/example\/apple_IP\.mrs \}/,
      );
      assert.match(
        readme,
        /apple: \{ <<: \*yaml, url: https:\/\/raw\.githubusercontent\.com\/xream\/rule\/release\/example\/apple\.yaml \}/,
      );
      assert.match(
        readme,
        /github-token-header: &github-token-header \{ Authorization: \["Bearer <YOUR_GITHUB_TOKEN>"\] \}/,
      );
      assert.match(
        readme,
        /ip: &ip \{ type: http, behavior: ipcidr, format: mrs, interval: 86400, header: \*github-token-header \}/,
      );
      assert.match(
        readme,
        /yaml: &yaml \{ type: http, behavior: classical, format: yaml, interval: 86400, header: \*github-token-header \}/,
      );
      assert.doesNotMatch(readme, /apple_IPCIDR/);
      assert.doesNotMatch(readme, /apple\.ipcidr\.mrs/);
      assert.doesNotMatch(
        readme,
        /raw\.githubusercontent\.com\/xream\/rule\/release\/example\/apple_Domain\.txt/,
      );
      assert.doesNotMatch(readme, /disabled\.original/);
      const log = await fs.readFile(logPath, "utf8");
      assert.match(log, /convert-ruleset\|domain\|text\|/);
      assert.match(log, /convert-ruleset\|ipcidr\|mrs\|/);
    },
  );
});

test("groups source entries by config file unless separate is true", async () => {
  await withProject(
    {
      "source/example/bundle.yaml": `
- name: grouped-a
  type: inline
  behavior: classical
  format: yaml
  payload:
    - DOMAIN,a.example
- name: grouped-b
  type: inline
  behavior: classical
  format: yaml
  payload:
    - DOMAIN,b.example
- name: standalone
  separate: true
  type: inline
  behavior: classical
  format: yaml
  payload:
    - DOMAIN,standalone.example
`,
    },
    async ({ root, mihomoPath }) => {
      await buildRelease({
        projectRoot: root,
        repository: "xream/rule",
        mihomoPath,
      });
      const output = path.join(root, ".release", "example");
      assert.equal(
        await fs.readFile(path.join(output, "bundle_Domain.txt"), "utf8"),
        "mrs:a.example\nb.example\n",
      );
      assert.equal(
        await fs.readFile(path.join(output, "standalone_Domain.txt"), "utf8"),
        "mrs:standalone.example\n",
      );
      assert.equal(
        await fs.readFile(path.join(output, "bundle_IP.txt"), "utf8"),
        "IP-CIDR,203.0.113.1/32\n",
      );
      assert.equal(
        await fs.readFile(path.join(output, "bundle.yaml"), "utf8"),
        "payload:\n  - DOMAIN,blackhole.invalid\n",
      );
      const readme = await fs.readFile(path.join(output, "README.md"), "utf8");
      assert.match(readme, /RULE-SET,bundle_Domain,bundle/);
      assert.match(readme, /RULE-SET,standalone_Domain,bundle/);
      assert.match(
        readme,
        /RULE-SET,bundle,bundle,no-resolve # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole\.invalid only/,
      );
      assert.match(
        readme,
        /RULE-SET,bundle_IP,bundle,no-resolve # placeholder: upstream currently has no ipcidr rules; contains 203\.0\.113\.1\/32 only/,
      );
      assert.match(
        readme,
        /bundle: \{ <<: \*yaml, url: https:\/\/raw\.githubusercontent\.com\/xream\/rule\/release\/example\/bundle\.yaml \} # placeholder: upstream currently has no remaining rules/,
      );
      assert.doesNotMatch(readme, /name: "standalone"/);
      assert.match(
        readme,
        /Sources: \[grouped-a\.original\.yaml\].*\[grouped-b\.original\.yaml\]/,
      );
      assert.match(readme, /Source: \[standalone\.original\.yaml\]/);
    },
  );
});

test("keeps original artifacts distinct for same-named entries in different config files", async () => {
  await withProject(
    {
      "source/example/apple.yaml": `
- name: rules
  type: inline
  behavior: classical
  format: yaml
  payload:
    - DOMAIN,apple.example
`,
      "source/example/google.yaml": `
- name: rules
  type: inline
  behavior: classical
  format: yaml
  payload:
    - DOMAIN,google.example
`,
    },
    async ({ root, mihomoPath }) => {
      await buildRelease({
        projectRoot: root,
        repository: "xream/rule",
        mihomoPath,
      });
      const output = path.join(root, ".release", "example");
      assert.equal(
        await fs.readFile(path.join(output, "apple_Domain.txt"), "utf8"),
        "mrs:apple.example\n",
      );
      assert.equal(
        await fs.readFile(path.join(output, "google_Domain.txt"), "utf8"),
        "mrs:google.example\n",
      );
      assert.equal(
        await fs.readFile(
          path.join(output, "apple_rules.original.yaml"),
          "utf8",
        ),
        "payload:\n  - DOMAIN,apple.example\n",
      );
      assert.equal(
        await fs.readFile(
          path.join(output, "google_rules.original.yaml"),
          "utf8",
        ),
        "payload:\n  - DOMAIN,google.example\n",
      );
      await assert.rejects(() =>
        fs.access(path.join(output, "rules.original.yaml")),
      );
      const readme = await fs.readFile(path.join(output, "README.md"), "utf8");
      const sourceFilesSection = readme.slice(
        readme.indexOf("## Source Files"),
        readme.indexOf("## Mihomo Config"),
      );
      assert.match(
        sourceFilesSection,
        /\[apple_rules\.original\.yaml\]\(https:\/\/github\.com\/xream\/rule\/blob\/release\/example\/apple_rules\.original\.yaml\)/,
      );
      assert.match(
        sourceFilesSection,
        /\[google_rules\.original\.yaml\]\(https:\/\/github\.com\/xream\/rule\/blob\/release\/example\/google_rules\.original\.yaml\)/,
      );
      assert.match(
        readme,
        /#### apple_Domain\.mrs[\s\S]*Source: \[apple_rules\.original\.yaml\]/,
      );
      assert.match(
        readme,
        /#### google_Domain\.mrs[\s\S]*Source: \[google_rules\.original\.yaml\]/,
      );
    },
  );
});

test("deduplicates grouped rules while preserving first occurrence order", async () => {
  await withProject(
    {
      "source/example/dedupe.yaml": `
- name: first
  type: inline
  behavior: classical
  format: yaml
  payload:
    - DOMAIN,first.example
    - DOMAIN-SUFFIX,shared.example
    - PROCESS-NAME,SharedApp
- name: second
  type: inline
  behavior: classical
  format: yaml
  payload:
    - DOMAIN-SUFFIX,shared.example
    - DOMAIN,second.example
    - PROCESS-NAME,SharedApp
`,
    },
    async ({ root, mihomoPath }) => {
      await buildRelease({
        projectRoot: root,
        repository: "xream/rule",
        mihomoPath,
      });
      const output = path.join(root, ".release", "example");
      assert.equal(
        await fs.readFile(path.join(output, "dedupe_Domain.txt"), "utf8"),
        "mrs:first.example\n+.shared.example\nsecond.example\n",
      );
      assert.equal(
        await fs.readFile(path.join(output, "dedupe.yaml"), "utf8"),
        "payload:\n  - PROCESS-NAME,SharedApp\n",
      );
      assert.equal(
        await fs.readFile(path.join(output, "dedupe_IP.txt"), "utf8"),
        "IP-CIDR,203.0.113.1/32\n",
      );
      const readme = await fs.readFile(path.join(output, "README.md"), "utf8");
      assert.match(
        readme,
        /dedupe_IP: \{ <<: \*ip, url: https:\/\/raw\.githubusercontent\.com\/xream\/rule\/release\/example\/dedupe_IP\.mrs \} # placeholder: upstream currently has no ipcidr rules/,
      );
      assert.match(
        readme,
        /Sources: \[first\.original\.yaml\].*\[second\.original\.yaml\]/,
      );
      assert.match(readme, /Source: \[first\.original\.yaml\]/);
    },
  );
});

test("fake-ip-filter entries only generate domain mrs and ignore route entries in the same config", async () => {
  await withProject(
    {
      "source/example/mixed.yaml": `
- name: fake
  type: inline
  behavior: classical
  format: yaml
  mihomo: fake-ip-filter
  payload:
    - DOMAIN,fake.example
    - IP-CIDR,10.0.0.0/8
    - PROCESS-NAME,FakeApp
- name: route
  type: inline
  behavior: classical
  format: yaml
  payload:
    - DOMAIN,route.example
    - IP-CIDR,192.0.2.0/24
    - PROCESS-NAME,RouteApp
`,
    },
    async ({ root, mihomoPath }) => {
      const warnings = [];
      await buildRelease({
        projectRoot: root,
        repository: "xream/rule",
        mihomoPath,
        warn: (message) => warnings.push(message),
      });
      const output = path.join(root, ".release", "example");
      assert.equal(
        await fs.readFile(
          path.join(output, "mixed_Domain.txt"),
          "utf8",
        ),
        "mrs:fake.example\n",
      );
      await assert.rejects(() =>
        fs.access(path.join(output, "mixed_IP.mrs")),
      );
      await assert.rejects(() =>
        fs.access(path.join(output, "mixed.yaml")),
      );
      await assert.rejects(() => fs.access(path.join(output, "mixed_IP.txt")));
      await assert.rejects(() =>
        fs.access(path.join(output, "route.original.yaml")),
      );

      const readme = await fs.readFile(path.join(output, "README.md"), "utf8");
      assert.match(readme, /dns:/);
      assert.doesNotMatch(readme, /proxy-groups:/);
      assert.doesNotMatch(readme, /rules:/);
      assert.match(readme, /fake-ip-filter:\n    - "rule-set:mixed_Domain"/);
      assert.match(
        readme,
        /mixed_Domain: \{ <<: \*domain, url: https:\/\/raw\.githubusercontent\.com\/xream\/rule\/release\/example\/mixed_Domain\.mrs \}/,
      );
      assert.match(
        readme,
        /github-token-header: &github-token-header \{ Authorization: \["Bearer <YOUR_GITHUB_TOKEN>"\] \}/,
      );
      assert.match(
        readme,
        /domain: &domain \{ type: http, behavior: domain, format: mrs, interval: 86400, header: \*github-token-header \}/,
      );
      assert.doesNotMatch(readme, /RULE-SET,mixed_Domain,mixed/);
      assert.doesNotMatch(readme, /RULE-SET,mixed_IP,mixed,no-resolve/);
      assert.deepEqual(warnings, [
        "[warn] example:route: ignored because mixed.yaml contains mihomo: fake-ip-filter; non fake-ip-filter entries in that YAML are ignored.",
        "[warn] example:fake: mihomo: fake-ip-filter only supports domain mrs; ignored 1 ipcidr, 1 remaining rules.",
      ]);
    },
  );
});

test("fetches http sources and writes original artifacts", async () => {
  await withProject(
    {
      "source/http/source.yaml": `
- name: remote
  description: Remote fixture
  type: http
  url: https://example.com/rules.txt
  headers:
    User-Agent: rule-test
    X-Rule-Source: fixture
  behavior: classical
  format: text
`,
    },
    async ({ root, mihomoPath }) => {
      await buildRelease({
        projectRoot: root,
        repository: "xream/rule",
        mihomoPath,
        fetchImpl: async (url, options) => {
          assert.equal(url, "https://example.com/rules.txt");
          assert.deepEqual(options, {
            headers: {
              "User-Agent": "rule-test",
              "X-Rule-Source": "fixture",
            },
          });
          return new Response("DOMAIN,remote.example\n");
        },
      });
      assert.equal(
        await fs.readFile(
          path.join(root, ".release", "http", "remote.original.txt"),
          "utf8",
        ),
        "DOMAIN,remote.example\n",
      );
    },
  );
});

test("adds custom GitHub token to GitHub source requests", async () => {
  await withCustomGitHubToken("test-token", async () => {
    await withProject(
      {
        "source/http/source.yaml": `
- name: remote
  type: http
  url: https://raw.githubusercontent.com/example/private/main/rules.txt
  behavior: classical
  format: text
`,
      },
      async ({ root, mihomoPath }) => {
        await buildRelease({
          projectRoot: root,
          repository: "xream/rule",
          mihomoPath,
          fetchImpl: async (url, options) => {
            assert.equal(
              url,
              "https://raw.githubusercontent.com/example/private/main/rules.txt",
            );
            assert.deepEqual(options, {
              headers: {
                Authorization: "Bearer test-token",
              },
            });
            return new Response("DOMAIN,remote.example\n");
          },
        });
      },
    );
  });
});

test("writes inline payloads as original artifacts", async () => {
  await withProject(
    {
      "source/inline/source.yaml": `
- name: inline-rules
  description: Inline fixture
  type: inline
  payload:
    - DOMAIN,inline.example
  behavior: classical
  format: text
`,
    },
    async ({ root, mihomoPath }) => {
      await buildRelease({
        projectRoot: root,
        repository: "xream/rule",
        mihomoPath,
      });
      assert.equal(
        await fs.readFile(
          path.join(root, ".release", "inline", "inline-rules.original.txt"),
          "utf8",
        ),
        "DOMAIN,inline.example\n",
      );
      const readme = await fs.readFile(
        path.join(root, ".release", "inline", "README.md"),
        "utf8",
      );
      const sourceFilesSection = readme.slice(
        readme.indexOf("## Source Files"),
        readme.indexOf("## Mihomo Config"),
      );
      assert.match(
        sourceFilesSection,
        /\[inline-rules\.original\.txt\]\(https:\/\/github\.com\/xream\/rule\/blob\/release\/inline\/inline-rules\.original\.txt\)/,
      );
      assert.doesNotMatch(sourceFilesSection, /DOMAIN,inline\.example/);
    },
  );
});

test("rejects destructive output and work directories before reset", async () => {
  await withProject(
    {
      "source/example/source.yaml": `
- name: inline-rules
  type: inline
  payload:
    - DOMAIN,inline.example
  behavior: classical
  format: yaml
`,
    },
    async ({ root, mihomoPath }) => {
      const sourceConfigPath = path.join(
        root,
        "source",
        "example",
        "source.yaml",
      );
      const cases = [
        {
          options: { outputRoot: root },
          message: /outputRoot must not be the project root/,
        },
        {
          options: { outputRoot: path.join(root, "source") },
          message: /outputRoot must not overlap sourceRoot/,
        },
        {
          options: { workRoot: path.join(root, "source", "work") },
          message: /workRoot must not overlap sourceRoot/,
        },
        {
          options: { outputRoot: path.join(root, "scripts") },
          message:
            /outputRoot inside projectRoot must be under \.release or \.release-work/,
        },
        {
          options: { workRoot: path.join(root, ".github") },
          message:
            /workRoot inside projectRoot must be under \.release or \.release-work/,
        },
        {
          options: {
            outputRoot: path.join(root, ".release"),
            workRoot: path.join(root, ".release", "work"),
          },
          message: /outputRoot and workRoot must not overlap/,
        },
      ];

      for (const testCase of cases) {
        await assert.rejects(
          () =>
            buildRelease({
              projectRoot: root,
              repository: "xream/rule",
              mihomoPath,
              ...testCase.options,
            }),
          testCase.message,
        );
        assert.match(
          await fs.readFile(sourceConfigPath, "utf8"),
          /inline-rules/,
        );
      }
    },
  );
});

test("fails with source entry context when local file is missing", async () => {
  await withProject(
    {
      "source/example/source.yaml": `
- name: missing
  type: file
  path: missing.yaml
  behavior: classical
  format: yaml
`,
    },
    async ({ root, mihomoPath }) => {
      await assert.rejects(
        () =>
          buildRelease({
            projectRoot: root,
            repository: "xream/rule",
            mihomoPath,
          }),
        /example:missing: failed to read missing.yaml/,
      );
    },
  );
});

test("warns and ignores rules unsupported by generated classical rule-providers", async () => {
  await withProject(
    {
      "source/example/source.yaml": `
- name: unsupported
  type: inline
  behavior: classical
  format: yaml
  payload:
    - RULE-SET,other-provider
    - MATCH,DIRECT
    - PROCESS-NAME,Example.app
`,
    },
    async ({ root, mihomoPath }) => {
      const warnings = [];
      await buildRelease({
        projectRoot: root,
        repository: "xream/rule",
        mihomoPath,
        warn: (message) => warnings.push(message),
      });
      assert.deepEqual(warnings, [
        "[warn] example:unsupported: ignored unsupported rules for generated classical rule-provider: RULE-SET,other-provider; MATCH,DIRECT. MATCH, RULE-SET, and SUB-RULE cannot be used inside a classical rule-provider.",
      ]);
      assert.equal(
        await fs.readFile(path.join(root, ".release", "example", "source.yaml"), "utf8"),
        "payload:\n  - PROCESS-NAME,Example.app\n",
      );
    },
  );
});
