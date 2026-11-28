# CN

Source config: [CN.yaml](https://github.com/xream/rule/blob/main/source/CN/CN.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| cn-additional-list | https://www.nodeseek.com/post-464238-6 | true | http | domain | text | rules |  | [cn-additional-list.txt](https://static-file-global.353355.xyz/rules/cn-additional-list.txt) |  |  |
| geolocation-cn | geolocation-cn | true | http | domain | text | rules |  | [geolocation-cn.list](https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/geolocation-cn.list) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "CN"
    type: select
    proxies: []
rules:
  - RULE-SET,CN_Domain,CN
  - RULE-SET,CN,CN,no-resolve # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
  - RULE-SET,CN_IP,CN,no-resolve # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  CN_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/CN/CN_Domain.mrs }
  CN: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/CN/CN.yaml } # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
  CN_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/CN/CN_IP.mrs } # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
```

## Artifacts

### mrs(ipcidr)

#### CN_IP.mrs

GitHub: [CN_IP.mrs](https://github.com/xream/rule/blob/release/CN/CN_IP.mrs)
Text: [CN_IP.txt](https://github.com/xream/rule/blob/release/CN/CN_IP.txt)
Placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
Sources: [cn-additional-list.original.txt](https://github.com/xream/rule/blob/release/CN/cn-additional-list.original.txt), [geolocation-cn.original.list](https://github.com/xream/rule/blob/release/CN/geolocation-cn.original.list)

```text
https://raw.githubusercontent.com/xream/rule/release/CN/CN_IP.mrs
```

### mrs(domain)

#### CN_Domain.mrs

GitHub: [CN_Domain.mrs](https://github.com/xream/rule/blob/release/CN/CN_Domain.mrs)
Text: [CN_Domain.txt](https://github.com/xream/rule/blob/release/CN/CN_Domain.txt)
Sources: [cn-additional-list.original.txt](https://github.com/xream/rule/blob/release/CN/cn-additional-list.original.txt), [geolocation-cn.original.list](https://github.com/xream/rule/blob/release/CN/geolocation-cn.original.list)

```text
https://raw.githubusercontent.com/xream/rule/release/CN/CN_Domain.mrs
```

### yaml(remaining)

#### CN.yaml

GitHub: [CN.yaml](https://github.com/xream/rule/blob/release/CN/CN.yaml)
Placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
Sources: [cn-additional-list.original.txt](https://github.com/xream/rule/blob/release/CN/cn-additional-list.original.txt), [geolocation-cn.original.list](https://github.com/xream/rule/blob/release/CN/geolocation-cn.original.list)

```text
https://raw.githubusercontent.com/xream/rule/release/CN/CN.yaml
```
