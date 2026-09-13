# PayPal

Source config: [PayPal.yaml](https://github.com/xream/rule/blob/main/source/PayPal/PayPal.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| PayPal | PayPal | true | http | classical | yaml | rules |  | [PayPal.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/PayPal/PayPal.yaml) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "PayPal"
    type: select
    proxies: []
rules:
  - RULE-SET,PayPal_Domain,PayPal
  - RULE-SET,PayPal,PayPal,no-resolve
  - RULE-SET,PayPal_IP,PayPal,no-resolve # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  PayPal_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/PayPal/PayPal_Domain.mrs }
  PayPal: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/PayPal/PayPal.yaml }
  PayPal_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/PayPal/PayPal_IP.mrs } # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
```

## Artifacts

### mrs(ipcidr)

#### PayPal_IP.mrs

GitHub: [PayPal_IP.mrs](https://github.com/xream/rule/blob/release/PayPal/PayPal_IP.mrs)
Text: [PayPal_IP.txt](https://github.com/xream/rule/blob/release/PayPal/PayPal_IP.txt)
Placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
Source: [PayPal.original.yaml](https://github.com/xream/rule/blob/release/PayPal/PayPal.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/PayPal/PayPal_IP.mrs
```

### mrs(domain)

#### PayPal_Domain.mrs

GitHub: [PayPal_Domain.mrs](https://github.com/xream/rule/blob/release/PayPal/PayPal_Domain.mrs)
Text: [PayPal_Domain.txt](https://github.com/xream/rule/blob/release/PayPal/PayPal_Domain.txt)
Source: [PayPal.original.yaml](https://github.com/xream/rule/blob/release/PayPal/PayPal.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/PayPal/PayPal_Domain.mrs
```

### yaml(remaining)

#### PayPal.yaml

GitHub: [PayPal.yaml](https://github.com/xream/rule/blob/release/PayPal/PayPal.yaml)
Source: [PayPal.original.yaml](https://github.com/xream/rule/blob/release/PayPal/PayPal.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/PayPal/PayPal.yaml
```
