# CDN

Source config: [CDN.yaml](https://github.com/xream/rule/blob/main/source/CDN/CDN.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| QuixoticHeart |  | true | http | classical | text | rules |  | [cdn.list](https://raw.githubusercontent.com/QuixoticHeart/rule-set/refs/heads/ruleset/meta/cdn.list) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "CDN"
    type: select
    proxies: []
rules:
  - RULE-SET,CDN_Domain,CDN
  - RULE-SET,CDN,CDN,no-resolve
  - RULE-SET,CDN_IP,CDN,no-resolve # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  CDN_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/CDN/CDN_Domain.mrs }
  CDN: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/CDN/CDN.yaml }
  CDN_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/CDN/CDN_IP.mrs } # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
```

## Artifacts

### mrs(ipcidr)

#### CDN_IP.mrs

GitHub: [CDN_IP.mrs](https://github.com/xream/rule/blob/release/CDN/CDN_IP.mrs)
Text: [CDN_IP.txt](https://github.com/xream/rule/blob/release/CDN/CDN_IP.txt)
Placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
Source: [QuixoticHeart.original.list](https://github.com/xream/rule/blob/release/CDN/QuixoticHeart.original.list)

```text
https://raw.githubusercontent.com/xream/rule/release/CDN/CDN_IP.mrs
```

### mrs(domain)

#### CDN_Domain.mrs

GitHub: [CDN_Domain.mrs](https://github.com/xream/rule/blob/release/CDN/CDN_Domain.mrs)
Text: [CDN_Domain.txt](https://github.com/xream/rule/blob/release/CDN/CDN_Domain.txt)
Source: [QuixoticHeart.original.list](https://github.com/xream/rule/blob/release/CDN/QuixoticHeart.original.list)

```text
https://raw.githubusercontent.com/xream/rule/release/CDN/CDN_Domain.mrs
```

### yaml(remaining)

#### CDN.yaml

GitHub: [CDN.yaml](https://github.com/xream/rule/blob/release/CDN/CDN.yaml)
Source: [QuixoticHeart.original.list](https://github.com/xream/rule/blob/release/CDN/QuixoticHeart.original.list)

```text
https://raw.githubusercontent.com/xream/rule/release/CDN/CDN.yaml
```
