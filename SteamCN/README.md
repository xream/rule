# SteamCN

Source config: [SteamCN.yaml](https://github.com/xream/rule/blob/main/source/SteamCN/SteamCN.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| SteamCN | SteamCN | true | http | classical | yaml | rules |  | [SteamCN.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/SteamCN/SteamCN.yaml) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "SteamCN"
    type: select
    proxies: []
rules:
  - RULE-SET,SteamCN_Domain,SteamCN
  - RULE-SET,SteamCN,SteamCN,no-resolve # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
  - RULE-SET,SteamCN_IP,SteamCN,no-resolve # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  SteamCN_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/SteamCN/SteamCN_Domain.mrs }
  SteamCN: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/SteamCN/SteamCN.yaml } # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
  SteamCN_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/SteamCN/SteamCN_IP.mrs } # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
```

## Artifacts

### mrs(ipcidr)

#### SteamCN_IP.mrs

GitHub: [SteamCN_IP.mrs](https://github.com/xream/rule/blob/release/SteamCN/SteamCN_IP.mrs)
Text: [SteamCN_IP.txt](https://github.com/xream/rule/blob/release/SteamCN/SteamCN_IP.txt)
Placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
Source: [SteamCN.original.yaml](https://github.com/xream/rule/blob/release/SteamCN/SteamCN.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/SteamCN/SteamCN_IP.mrs
```

### mrs(domain)

#### SteamCN_Domain.mrs

GitHub: [SteamCN_Domain.mrs](https://github.com/xream/rule/blob/release/SteamCN/SteamCN_Domain.mrs)
Text: [SteamCN_Domain.txt](https://github.com/xream/rule/blob/release/SteamCN/SteamCN_Domain.txt)
Source: [SteamCN.original.yaml](https://github.com/xream/rule/blob/release/SteamCN/SteamCN.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/SteamCN/SteamCN_Domain.mrs
```

### yaml(remaining)

#### SteamCN.yaml

GitHub: [SteamCN.yaml](https://github.com/xream/rule/blob/release/SteamCN/SteamCN.yaml)
Placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
Source: [SteamCN.original.yaml](https://github.com/xream/rule/blob/release/SteamCN/SteamCN.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/SteamCN/SteamCN.yaml
```
