# GitHub

Source config: [GitHub.yaml](https://github.com/xream/rule/blob/main/source/GitHub/GitHub.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| GitHub | GitHub | true | http | classical | yaml | rules |  | [GitHub.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.yaml) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "GitHub"
    type: select
    proxies: []
rules:
  - RULE-SET,GitHub_Domain,GitHub
  - RULE-SET,GitHub,GitHub,no-resolve
  - RULE-SET,GitHub_IP,GitHub,no-resolve # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  GitHub_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/GitHub/GitHub_Domain.mrs }
  GitHub: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/GitHub/GitHub.yaml }
  GitHub_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/GitHub/GitHub_IP.mrs } # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
```

## Artifacts

### mrs(ipcidr)

#### GitHub_IP.mrs

GitHub: [GitHub_IP.mrs](https://github.com/xream/rule/blob/release/GitHub/GitHub_IP.mrs)
Text: [GitHub_IP.txt](https://github.com/xream/rule/blob/release/GitHub/GitHub_IP.txt)
Placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
Source: [GitHub.original.yaml](https://github.com/xream/rule/blob/release/GitHub/GitHub.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/GitHub/GitHub_IP.mrs
```

### mrs(domain)

#### GitHub_Domain.mrs

GitHub: [GitHub_Domain.mrs](https://github.com/xream/rule/blob/release/GitHub/GitHub_Domain.mrs)
Text: [GitHub_Domain.txt](https://github.com/xream/rule/blob/release/GitHub/GitHub_Domain.txt)
Source: [GitHub.original.yaml](https://github.com/xream/rule/blob/release/GitHub/GitHub.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/GitHub/GitHub_Domain.mrs
```

### yaml(remaining)

#### GitHub.yaml

GitHub: [GitHub.yaml](https://github.com/xream/rule/blob/release/GitHub/GitHub.yaml)
Source: [GitHub.original.yaml](https://github.com/xream/rule/blob/release/GitHub/GitHub.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/GitHub/GitHub.yaml
```
