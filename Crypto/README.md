# Crypto

Source config: [Crypto.yaml](https://github.com/xream/rule/blob/main/source/Crypto/Crypto.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| Alice |  | true | http | classical | text | rules |  | [Crypto.list](https://raw.githubusercontent.com/EAlyce/conf/main/Rule/Crypto.list) |  |  |
| Crypto | Crypto | true | http | classical | yaml | rules |  | [Crypto.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Crypto/Crypto.yaml) |  |  |
| Cryptocurrency | Cryptocurrency | true | http | classical | yaml | rules |  | [Cryptocurrency.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Cryptocurrency/Cryptocurrency.yaml) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "Crypto"
    type: select
    proxies: []
rules:
  - RULE-SET,Crypto_Domain,Crypto
  - RULE-SET,Crypto,Crypto,no-resolve
  - RULE-SET,Crypto_IP,Crypto,no-resolve
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  Crypto_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/Crypto/Crypto_Domain.mrs }
  Crypto: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/Crypto/Crypto.yaml }
  Crypto_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/Crypto/Crypto_IP.mrs }
```

## Artifacts

### mrs(ipcidr)

#### Crypto_IP.mrs

GitHub: [Crypto_IP.mrs](https://github.com/xream/rule/blob/release/Crypto/Crypto_IP.mrs)
Text: [Crypto_IP.txt](https://github.com/xream/rule/blob/release/Crypto/Crypto_IP.txt)
Source: [Alice.original.list](https://github.com/xream/rule/blob/release/Crypto/Alice.original.list)

```text
https://raw.githubusercontent.com/xream/rule/release/Crypto/Crypto_IP.mrs
```

### mrs(domain)

#### Crypto_Domain.mrs

GitHub: [Crypto_Domain.mrs](https://github.com/xream/rule/blob/release/Crypto/Crypto_Domain.mrs)
Text: [Crypto_Domain.txt](https://github.com/xream/rule/blob/release/Crypto/Crypto_Domain.txt)
Sources: [Alice.original.list](https://github.com/xream/rule/blob/release/Crypto/Alice.original.list), [Crypto.original.yaml](https://github.com/xream/rule/blob/release/Crypto/Crypto.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Crypto/Crypto_Domain.mrs
```

### yaml(remaining)

#### Crypto.yaml

GitHub: [Crypto.yaml](https://github.com/xream/rule/blob/release/Crypto/Crypto.yaml)
Source: [Crypto.original.yaml](https://github.com/xream/rule/blob/release/Crypto/Crypto.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Crypto/Crypto.yaml
```
