# AI

Source config: [AI.yaml](https://github.com/xream/rule/blob/main/source/AI/AI.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| Alice |  | true | http | classical | text | rules |  | [OpenAI.list](https://raw.githubusercontent.com/EAlyce/conf/refs/heads/main/Rule/OpenAI.list) |  |  |
| Sukka |  | true | http | classical | text | rules |  | [ai.txt](https://ruleset.skk.moe/Clash/non_ip/ai.txt) |  |  |
| iKeLee |  | true | http | classical | yaml | rules | User-Agent: Loon/649 CFNetwork/1492.0.1 Darwin/23.3.0 | [AI.yaml](https://kelee.one/Tool/Clash/Rule/AI.yaml) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "AI"
    type: select
    proxies: []
rules:
  - RULE-SET,AI_Domain,AI
  - RULE-SET,AI,AI,no-resolve
  - RULE-SET,AI_IP,AI,no-resolve
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  AI_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/AI/AI_Domain.mrs }
  AI: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/AI/AI.yaml }
  AI_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/AI/AI_IP.mrs }
```

## Artifacts

### mrs(ipcidr)

#### AI_IP.mrs

GitHub: [AI_IP.mrs](https://github.com/xream/rule/blob/release/AI/AI_IP.mrs)
Text: [AI_IP.txt](https://github.com/xream/rule/blob/release/AI/AI_IP.txt)
Sources: [Alice.original.list](https://github.com/xream/rule/blob/release/AI/Alice.original.list), [iKeLee.original.yaml](https://github.com/xream/rule/blob/release/AI/iKeLee.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/AI/AI_IP.mrs
```

### mrs(domain)

#### AI_Domain.mrs

GitHub: [AI_Domain.mrs](https://github.com/xream/rule/blob/release/AI/AI_Domain.mrs)
Text: [AI_Domain.txt](https://github.com/xream/rule/blob/release/AI/AI_Domain.txt)
Sources: [Alice.original.list](https://github.com/xream/rule/blob/release/AI/Alice.original.list), [iKeLee.original.yaml](https://github.com/xream/rule/blob/release/AI/iKeLee.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/AI/AI_Domain.mrs
```

### yaml(remaining)

#### AI.yaml

GitHub: [AI.yaml](https://github.com/xream/rule/blob/release/AI/AI.yaml)
Sources: [Alice.original.list](https://github.com/xream/rule/blob/release/AI/Alice.original.list), [Sukka.original.txt](https://github.com/xream/rule/blob/release/AI/Sukka.original.txt)

```text
https://raw.githubusercontent.com/xream/rule/release/AI/AI.yaml
```
