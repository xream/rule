# AppleProxy

Source config: [AppleProxy.yaml](https://github.com/xream/rule/blob/main/source/AppleProxy/AppleProxy.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| AppleProxy | AppleProxy | true | http | classical | yaml | rules |  | [AppleProxy.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/AppleProxy/AppleProxy.yaml) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "AppleProxy"
    type: select
    proxies: []
rules:
  - RULE-SET,AppleProxy_Domain,AppleProxy
  - RULE-SET,AppleProxy,AppleProxy,no-resolve
  - RULE-SET,AppleProxy_IP,AppleProxy,no-resolve # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  AppleProxy_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/AppleProxy/AppleProxy_Domain.mrs }
  AppleProxy: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/AppleProxy/AppleProxy.yaml }
  AppleProxy_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/AppleProxy/AppleProxy_IP.mrs } # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
```

## Artifacts

### mrs(ipcidr)

#### AppleProxy_IP.mrs

GitHub: [AppleProxy_IP.mrs](https://github.com/xream/rule/blob/release/AppleProxy/AppleProxy_IP.mrs)
Text: [AppleProxy_IP.txt](https://github.com/xream/rule/blob/release/AppleProxy/AppleProxy_IP.txt)
Placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
Source: [AppleProxy.original.yaml](https://github.com/xream/rule/blob/release/AppleProxy/AppleProxy.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/AppleProxy/AppleProxy_IP.mrs
```

### mrs(domain)

#### AppleProxy_Domain.mrs

GitHub: [AppleProxy_Domain.mrs](https://github.com/xream/rule/blob/release/AppleProxy/AppleProxy_Domain.mrs)
Text: [AppleProxy_Domain.txt](https://github.com/xream/rule/blob/release/AppleProxy/AppleProxy_Domain.txt)
Source: [AppleProxy.original.yaml](https://github.com/xream/rule/blob/release/AppleProxy/AppleProxy.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/AppleProxy/AppleProxy_Domain.mrs
```

### yaml(remaining)

#### AppleProxy.yaml

GitHub: [AppleProxy.yaml](https://github.com/xream/rule/blob/release/AppleProxy/AppleProxy.yaml)
Source: [AppleProxy.original.yaml](https://github.com/xream/rule/blob/release/AppleProxy/AppleProxy.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/AppleProxy/AppleProxy.yaml
```
