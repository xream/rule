# BlockHttpDNS

Source config: [BlockHttpDNS.yaml](https://github.com/xream/rule/blob/main/source/BlockHttpDNS/BlockHttpDNS.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| BlockHttpDNS | BlockHttpDNS | true | http | classical | yaml | rules |  | [BlockHttpDNS.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/BlockHttpDNS/BlockHttpDNS.yaml) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "BlockHttpDNS"
    type: select
    proxies: []
rules:
  - RULE-SET,BlockHttpDNS_Domain,BlockHttpDNS
  - RULE-SET,BlockHttpDNS_IP,BlockHttpDNS,no-resolve
  - RULE-SET,BlockHttpDNS,BlockHttpDNS,no-resolve # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  BlockHttpDNS_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/BlockHttpDNS/BlockHttpDNS_Domain.mrs }
  BlockHttpDNS_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/BlockHttpDNS/BlockHttpDNS_IP.mrs }
  BlockHttpDNS: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/BlockHttpDNS/BlockHttpDNS.yaml } # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
```

## Artifacts

### mrs(ipcidr)

#### BlockHttpDNS_IP.mrs

GitHub: [BlockHttpDNS_IP.mrs](https://github.com/xream/rule/blob/release/BlockHttpDNS/BlockHttpDNS_IP.mrs)
Text: [BlockHttpDNS_IP.txt](https://github.com/xream/rule/blob/release/BlockHttpDNS/BlockHttpDNS_IP.txt)
Source: [BlockHttpDNS.original.yaml](https://github.com/xream/rule/blob/release/BlockHttpDNS/BlockHttpDNS.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/BlockHttpDNS/BlockHttpDNS_IP.mrs
```

### mrs(domain)

#### BlockHttpDNS_Domain.mrs

GitHub: [BlockHttpDNS_Domain.mrs](https://github.com/xream/rule/blob/release/BlockHttpDNS/BlockHttpDNS_Domain.mrs)
Text: [BlockHttpDNS_Domain.txt](https://github.com/xream/rule/blob/release/BlockHttpDNS/BlockHttpDNS_Domain.txt)
Source: [BlockHttpDNS.original.yaml](https://github.com/xream/rule/blob/release/BlockHttpDNS/BlockHttpDNS.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/BlockHttpDNS/BlockHttpDNS_Domain.mrs
```

### yaml(remaining)

#### BlockHttpDNS.yaml

GitHub: [BlockHttpDNS.yaml](https://github.com/xream/rule/blob/release/BlockHttpDNS/BlockHttpDNS.yaml)
Placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
Source: [BlockHttpDNS.original.yaml](https://github.com/xream/rule/blob/release/BlockHttpDNS/BlockHttpDNS.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/BlockHttpDNS/BlockHttpDNS.yaml
```
