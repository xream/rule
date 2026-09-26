# Lan

Source config: [Lan.yaml](https://github.com/xream/rule/blob/main/source/Lan/Lan.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| Lan | Lan | true | http | classical | yaml | rules |  | [Lan.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Lan/Lan.yaml) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "Lan"
    type: select
    proxies: []
rules:
  - RULE-SET,Lan_Domain,Lan
  - RULE-SET,Lan_IP,Lan,no-resolve
  - RULE-SET,Lan,Lan,no-resolve # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  Lan_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/Lan/Lan_Domain.mrs }
  Lan_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/Lan/Lan_IP.mrs }
  Lan: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/Lan/Lan.yaml } # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
```

## Artifacts

### mrs(ipcidr)

#### Lan_IP.mrs

GitHub: [Lan_IP.mrs](https://github.com/xream/rule/blob/release/Lan/Lan_IP.mrs)
Text: [Lan_IP.txt](https://github.com/xream/rule/blob/release/Lan/Lan_IP.txt)
Source: [Lan.original.yaml](https://github.com/xream/rule/blob/release/Lan/Lan.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Lan/Lan_IP.mrs
```

### mrs(domain)

#### Lan_Domain.mrs

GitHub: [Lan_Domain.mrs](https://github.com/xream/rule/blob/release/Lan/Lan_Domain.mrs)
Text: [Lan_Domain.txt](https://github.com/xream/rule/blob/release/Lan/Lan_Domain.txt)
Source: [Lan.original.yaml](https://github.com/xream/rule/blob/release/Lan/Lan.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Lan/Lan_Domain.mrs
```

### yaml(remaining)

#### Lan.yaml

GitHub: [Lan.yaml](https://github.com/xream/rule/blob/release/Lan/Lan.yaml)
Placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
Source: [Lan.original.yaml](https://github.com/xream/rule/blob/release/Lan/Lan.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Lan/Lan.yaml
```
