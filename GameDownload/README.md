# GameDownload

Source config: [GameDownload.yaml](https://github.com/xream/rule/blob/main/source/GameDownload/GameDownload.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| GameDownload | GameDownload | true | http | classical | yaml | rules |  | [GameDownload.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Game/GameDownload/GameDownload.yaml) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "GameDownload"
    type: select
    proxies: []
rules:
  - RULE-SET,GameDownload_Domain,GameDownload
  - RULE-SET,GameDownload,GameDownload,no-resolve # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
  - RULE-SET,GameDownload_IP,GameDownload,no-resolve # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  GameDownload_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/GameDownload/GameDownload_Domain.mrs }
  GameDownload: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/GameDownload/GameDownload.yaml } # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
  GameDownload_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/GameDownload/GameDownload_IP.mrs } # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
```

## Artifacts

### mrs(ipcidr)

#### GameDownload_IP.mrs

GitHub: [GameDownload_IP.mrs](https://github.com/xream/rule/blob/release/GameDownload/GameDownload_IP.mrs)
Text: [GameDownload_IP.txt](https://github.com/xream/rule/blob/release/GameDownload/GameDownload_IP.txt)
Placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
Source: [GameDownload.original.yaml](https://github.com/xream/rule/blob/release/GameDownload/GameDownload.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/GameDownload/GameDownload_IP.mrs
```

### mrs(domain)

#### GameDownload_Domain.mrs

GitHub: [GameDownload_Domain.mrs](https://github.com/xream/rule/blob/release/GameDownload/GameDownload_Domain.mrs)
Text: [GameDownload_Domain.txt](https://github.com/xream/rule/blob/release/GameDownload/GameDownload_Domain.txt)
Source: [GameDownload.original.yaml](https://github.com/xream/rule/blob/release/GameDownload/GameDownload.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/GameDownload/GameDownload_Domain.mrs
```

### yaml(remaining)

#### GameDownload.yaml

GitHub: [GameDownload.yaml](https://github.com/xream/rule/blob/release/GameDownload/GameDownload.yaml)
Placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
Source: [GameDownload.original.yaml](https://github.com/xream/rule/blob/release/GameDownload/GameDownload.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/GameDownload/GameDownload.yaml
```
