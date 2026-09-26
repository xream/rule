# Apple

Source config: [Apple.yaml](https://github.com/xream/rule/blob/main/source/Apple/Apple.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| Apple | Apple | true | http | classical | yaml | rules |  | [Apple.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple.yaml) |  |  |
| Apple_Domain | Apple Domain | true | http | domain | text | rules |  | [Apple_Domain.txt](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple_Domain.txt) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "Apple"
    type: select
    proxies: []
rules:
  - RULE-SET,Apple_Domain,Apple
  - RULE-SET,Apple,Apple,no-resolve
  - RULE-SET,Apple_IP,Apple,no-resolve
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  Apple_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/Apple/Apple_Domain.mrs }
  Apple: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/Apple/Apple.yaml }
  Apple_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/Apple/Apple_IP.mrs }
```

## Artifacts

### mrs(ipcidr)

#### Apple_IP.mrs

GitHub: [Apple_IP.mrs](https://github.com/xream/rule/blob/release/Apple/Apple_IP.mrs)
Text: [Apple_IP.txt](https://github.com/xream/rule/blob/release/Apple/Apple_IP.txt)
Source: [Apple.original.yaml](https://github.com/xream/rule/blob/release/Apple/Apple.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Apple/Apple_IP.mrs
```

### mrs(domain)

#### Apple_Domain.mrs

GitHub: [Apple_Domain.mrs](https://github.com/xream/rule/blob/release/Apple/Apple_Domain.mrs)
Text: [Apple_Domain.txt](https://github.com/xream/rule/blob/release/Apple/Apple_Domain.txt)
Source: [Apple_Domain.original.txt](https://github.com/xream/rule/blob/release/Apple/Apple_Domain.original.txt)

```text
https://raw.githubusercontent.com/xream/rule/release/Apple/Apple_Domain.mrs
```

### yaml(remaining)

#### Apple.yaml

GitHub: [Apple.yaml](https://github.com/xream/rule/blob/release/Apple/Apple.yaml)
Source: [Apple.original.yaml](https://github.com/xream/rule/blob/release/Apple/Apple.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Apple/Apple.yaml
```
