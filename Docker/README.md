# Docker

Source config: [Docker.yaml](https://github.com/xream/rule/blob/main/source/Docker/Docker.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| Docker | Docker | true | http | classical | yaml | rules |  | [Docker.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Docker/Docker.yaml) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "Docker"
    type: select
    proxies: []
rules:
  - RULE-SET,Docker_Domain,Docker
  - RULE-SET,Docker,Docker,no-resolve # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
  - RULE-SET,Docker_IP,Docker,no-resolve # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  Docker_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/Docker/Docker_Domain.mrs }
  Docker: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/Docker/Docker.yaml } # placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
  Docker_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/Docker/Docker_IP.mrs } # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
```

## Artifacts

### mrs(ipcidr)

#### Docker_IP.mrs

GitHub: [Docker_IP.mrs](https://github.com/xream/rule/blob/release/Docker/Docker_IP.mrs)
Text: [Docker_IP.txt](https://github.com/xream/rule/blob/release/Docker/Docker_IP.txt)
Placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
Source: [Docker.original.yaml](https://github.com/xream/rule/blob/release/Docker/Docker.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Docker/Docker_IP.mrs
```

### mrs(domain)

#### Docker_Domain.mrs

GitHub: [Docker_Domain.mrs](https://github.com/xream/rule/blob/release/Docker/Docker_Domain.mrs)
Text: [Docker_Domain.txt](https://github.com/xream/rule/blob/release/Docker/Docker_Domain.txt)
Source: [Docker.original.yaml](https://github.com/xream/rule/blob/release/Docker/Docker.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Docker/Docker_Domain.mrs
```

### yaml(remaining)

#### Docker.yaml

GitHub: [Docker.yaml](https://github.com/xream/rule/blob/release/Docker/Docker.yaml)
Placeholder: upstream currently has no remaining rules; contains DOMAIN,blackhole.invalid only
Source: [Docker.original.yaml](https://github.com/xream/rule/blob/release/Docker/Docker.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Docker/Docker.yaml
```
