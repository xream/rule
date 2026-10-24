# ChinaMaxNoIP

Source config: [ChinaMaxNoIP.yaml](https://github.com/xream/rule/blob/main/source/ChinaMaxNoIP/ChinaMaxNoIP.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| ChinaMaxNoIP | ChinaMaxNoIP | true | http | classical | yaml | rules |  | [ChinaMaxNoIP.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/ChinaMaxNoIP/ChinaMaxNoIP.yaml) |  |  |
| ChinaMaxNoIP_Domain | ChinaMaxNoIP Domain | true | http | domain | text | rules |  | [ChinaMaxNoIP_Domain.txt](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaMaxNoIP/ChinaMaxNoIP_Domain.txt) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "ChinaMaxNoIP"
    type: select
    proxies: []
rules:
  - RULE-SET,ChinaMaxNoIP_Domain,ChinaMaxNoIP
  - RULE-SET,ChinaMaxNoIP,ChinaMaxNoIP,no-resolve
  - RULE-SET,ChinaMaxNoIP_IP,ChinaMaxNoIP,no-resolve # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  ChinaMaxNoIP_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/ChinaMaxNoIP/ChinaMaxNoIP_Domain.mrs }
  ChinaMaxNoIP: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/ChinaMaxNoIP/ChinaMaxNoIP.yaml }
  ChinaMaxNoIP_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/ChinaMaxNoIP/ChinaMaxNoIP_IP.mrs } # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
```

## Artifacts

### mrs(ipcidr)

#### ChinaMaxNoIP_IP.mrs

GitHub: [ChinaMaxNoIP_IP.mrs](https://github.com/xream/rule/blob/release/ChinaMaxNoIP/ChinaMaxNoIP_IP.mrs)
Text: [ChinaMaxNoIP_IP.txt](https://github.com/xream/rule/blob/release/ChinaMaxNoIP/ChinaMaxNoIP_IP.txt)
Placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
Sources: [ChinaMaxNoIP.original.yaml](https://github.com/xream/rule/blob/release/ChinaMaxNoIP/ChinaMaxNoIP.original.yaml), [ChinaMaxNoIP_Domain.original.txt](https://github.com/xream/rule/blob/release/ChinaMaxNoIP/ChinaMaxNoIP_Domain.original.txt)

```text
https://raw.githubusercontent.com/xream/rule/release/ChinaMaxNoIP/ChinaMaxNoIP_IP.mrs
```

### mrs(domain)

#### ChinaMaxNoIP_Domain.mrs

GitHub: [ChinaMaxNoIP_Domain.mrs](https://github.com/xream/rule/blob/release/ChinaMaxNoIP/ChinaMaxNoIP_Domain.mrs)
Text: [ChinaMaxNoIP_Domain.txt](https://github.com/xream/rule/blob/release/ChinaMaxNoIP/ChinaMaxNoIP_Domain.txt)
Source: [ChinaMaxNoIP_Domain.original.txt](https://github.com/xream/rule/blob/release/ChinaMaxNoIP/ChinaMaxNoIP_Domain.original.txt)

```text
https://raw.githubusercontent.com/xream/rule/release/ChinaMaxNoIP/ChinaMaxNoIP_Domain.mrs
```

### yaml(remaining)

#### ChinaMaxNoIP.yaml

GitHub: [ChinaMaxNoIP.yaml](https://github.com/xream/rule/blob/release/ChinaMaxNoIP/ChinaMaxNoIP.yaml)
Source: [ChinaMaxNoIP.original.yaml](https://github.com/xream/rule/blob/release/ChinaMaxNoIP/ChinaMaxNoIP.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/ChinaMaxNoIP/ChinaMaxNoIP.yaml
```
