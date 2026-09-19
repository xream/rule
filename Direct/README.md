# Direct

Source config: [Direct.yaml](https://github.com/xream/rule/blob/main/source/Direct/Direct.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| Direct | Direct | true | http | classical | yaml | rules |  | [Direct.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Direct/Direct.yaml) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "Direct"
    type: select
    proxies: []
rules:
  - RULE-SET,Direct_Domain,Direct
  - RULE-SET,Direct,Direct,no-resolve
  - RULE-SET,Direct_IP,Direct,no-resolve # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  Direct_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/Direct/Direct_Domain.mrs }
  Direct: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/Direct/Direct.yaml }
  Direct_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/Direct/Direct_IP.mrs } # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
```

## Artifacts

### mrs(ipcidr)

#### Direct_IP.mrs

GitHub: [Direct_IP.mrs](https://github.com/xream/rule/blob/release/Direct/Direct_IP.mrs)
Text: [Direct_IP.txt](https://github.com/xream/rule/blob/release/Direct/Direct_IP.txt)
Placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
Source: [Direct.original.yaml](https://github.com/xream/rule/blob/release/Direct/Direct.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Direct/Direct_IP.mrs
```

### mrs(domain)

#### Direct_Domain.mrs

GitHub: [Direct_Domain.mrs](https://github.com/xream/rule/blob/release/Direct/Direct_Domain.mrs)
Text: [Direct_Domain.txt](https://github.com/xream/rule/blob/release/Direct/Direct_Domain.txt)
Source: [Direct.original.yaml](https://github.com/xream/rule/blob/release/Direct/Direct.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Direct/Direct_Domain.mrs
```

### yaml(remaining)

#### Direct.yaml

GitHub: [Direct.yaml](https://github.com/xream/rule/blob/release/Direct/Direct.yaml)
Source: [Direct.original.yaml](https://github.com/xream/rule/blob/release/Direct/Direct.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Direct/Direct.yaml
```
