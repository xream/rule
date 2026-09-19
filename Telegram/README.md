# Telegram

Source config: [Telegram.yaml](https://github.com/xream/rule/blob/main/source/Telegram/Telegram.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| Telegram | Telegram | true | http | classical | yaml | rules |  | [Telegram.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Telegram/Telegram.yaml) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "Telegram"
    type: select
    proxies: []
rules:
  - RULE-SET,Telegram_Domain,Telegram
  - RULE-SET,Telegram,Telegram,no-resolve
  - RULE-SET,Telegram_IP,Telegram,no-resolve
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  Telegram_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/Telegram/Telegram_Domain.mrs }
  Telegram: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/Telegram/Telegram.yaml }
  Telegram_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/Telegram/Telegram_IP.mrs }
```

## Artifacts

### mrs(ipcidr)

#### Telegram_IP.mrs

GitHub: [Telegram_IP.mrs](https://github.com/xream/rule/blob/release/Telegram/Telegram_IP.mrs)
Text: [Telegram_IP.txt](https://github.com/xream/rule/blob/release/Telegram/Telegram_IP.txt)
Source: [Telegram.original.yaml](https://github.com/xream/rule/blob/release/Telegram/Telegram.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Telegram/Telegram_IP.mrs
```

### mrs(domain)

#### Telegram_Domain.mrs

GitHub: [Telegram_Domain.mrs](https://github.com/xream/rule/blob/release/Telegram/Telegram_Domain.mrs)
Text: [Telegram_Domain.txt](https://github.com/xream/rule/blob/release/Telegram/Telegram_Domain.txt)
Source: [Telegram.original.yaml](https://github.com/xream/rule/blob/release/Telegram/Telegram.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Telegram/Telegram_Domain.mrs
```

### yaml(remaining)

#### Telegram.yaml

GitHub: [Telegram.yaml](https://github.com/xream/rule/blob/release/Telegram/Telegram.yaml)
Source: [Telegram.original.yaml](https://github.com/xream/rule/blob/release/Telegram/Telegram.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Telegram/Telegram.yaml
```
