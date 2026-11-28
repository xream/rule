# GameDownloadCN

Source config: [GameDownloadCN.yaml](https://github.com/xream/rule/blob/main/source/GameDownloadCN/GameDownloadCN.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| GameDownloadCN | GameDownloadCN | true | http | classical | yaml | rules |  | [GameDownloadCN.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Game/GameDownloadCN/GameDownloadCN.yaml) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "GameDownloadCN"
    type: select
    proxies: []
rules:
  - RULE-SET,GameDownloadCN_Domain,GameDownloadCN
  - RULE-SET,GameDownloadCN,GameDownloadCN,no-resolve # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
  - RULE-SET,GameDownloadCN_IP,GameDownloadCN,no-resolve # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  GameDownloadCN_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/GameDownloadCN/GameDownloadCN_Domain.mrs }
  GameDownloadCN: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/GameDownloadCN/GameDownloadCN.yaml } # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
  GameDownloadCN_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/GameDownloadCN/GameDownloadCN_IP.mrs } # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
```

## Artifacts

### mrs(ipcidr)

#### GameDownloadCN_IP.mrs

GitHub: [GameDownloadCN_IP.mrs](https://github.com/xream/rule/blob/release/GameDownloadCN/GameDownloadCN_IP.mrs)
Text: [GameDownloadCN_IP.txt](https://github.com/xream/rule/blob/release/GameDownloadCN/GameDownloadCN_IP.txt)
Placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
Source: [GameDownloadCN.original.yaml](https://github.com/xream/rule/blob/release/GameDownloadCN/GameDownloadCN.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/GameDownloadCN/GameDownloadCN_IP.mrs
```

### mrs(domain)

#### GameDownloadCN_Domain.mrs

GitHub: [GameDownloadCN_Domain.mrs](https://github.com/xream/rule/blob/release/GameDownloadCN/GameDownloadCN_Domain.mrs)
Text: [GameDownloadCN_Domain.txt](https://github.com/xream/rule/blob/release/GameDownloadCN/GameDownloadCN_Domain.txt)
Source: [GameDownloadCN.original.yaml](https://github.com/xream/rule/blob/release/GameDownloadCN/GameDownloadCN.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/GameDownloadCN/GameDownloadCN_Domain.mrs
```

### yaml(remaining)

#### GameDownloadCN.yaml

GitHub: [GameDownloadCN.yaml](https://github.com/xream/rule/blob/release/GameDownloadCN/GameDownloadCN.yaml)
Placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
Source: [GameDownloadCN.original.yaml](https://github.com/xream/rule/blob/release/GameDownloadCN/GameDownloadCN.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/GameDownloadCN/GameDownloadCN.yaml
```
