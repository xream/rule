# Global

Source config: [Global.yaml](https://github.com/xream/rule/blob/main/source/Global/Global.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| Global | Global | true | http | classical | yaml | rules |  | [Global.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Global/Global.yaml) |  |  |
| Global_Domain | Global Domain | true | http | domain | text | rules |  | [Global_Domain.txt](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Global/Global_Domain.txt) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "Global"
    type: select
    proxies: []
rules:
  - RULE-SET,Global_Domain,Global
  - RULE-SET,Global,Global,no-resolve
  - RULE-SET,Global_IP,Global,no-resolve
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  Global_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/Global/Global_Domain.mrs }
  Global: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/Global/Global.yaml }
  Global_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/Global/Global_IP.mrs }
```

## Artifacts

### mrs(ipcidr)

#### Global_IP.mrs

GitHub: [Global_IP.mrs](https://github.com/xream/rule/blob/release/Global/Global_IP.mrs)
Text: [Global_IP.txt](https://github.com/xream/rule/blob/release/Global/Global_IP.txt)
Source: [Global.original.yaml](https://github.com/xream/rule/blob/release/Global/Global.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Global/Global_IP.mrs
```

### mrs(domain)

#### Global_Domain.mrs

GitHub: [Global_Domain.mrs](https://github.com/xream/rule/blob/release/Global/Global_Domain.mrs)
Text: [Global_Domain.txt](https://github.com/xream/rule/blob/release/Global/Global_Domain.txt)
Source: [Global_Domain.original.txt](https://github.com/xream/rule/blob/release/Global/Global_Domain.original.txt)

```text
https://raw.githubusercontent.com/xream/rule/release/Global/Global_Domain.mrs
```

### yaml(remaining)

#### Global.yaml

GitHub: [Global.yaml](https://github.com/xream/rule/blob/release/Global/Global.yaml)
Source: [Global.original.yaml](https://github.com/xream/rule/blob/release/Global/Global.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Global/Global.yaml
```
