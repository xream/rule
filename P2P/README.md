# P2P

Source config: [P2P.yaml](https://github.com/xream/rule/blob/main/source/P2P/P2P.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| STUN | STUN | true | http | classical | yaml | rules |  | [STUN.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/STUN/STUN.yaml) |  |  |
| huya | huya | true | http | classical | text | rules |  | [Simple_Reject_Rule.list](https://gist.githubusercontent.com/sec7et/0c17021dec65107ff099e6a638a20d52/raw/Simple_Reject_Rule.list) |  |  |
| WebRTC | WebRTC | true | http | classical | text | rules |  | [WebRTC.list](https://raw.githubusercontent.com/GitMetaio/Surfing/refs/heads/rm/Home/rules/WebRTC.list) |  |  |
| P2P | P2P | true | inline | classical | yaml | rules |  |  |  | [P2P.original.yaml](https://github.com/xream/rule/blob/release/P2P/P2P.original.yaml) |

## Mihomo Config

```yaml
proxy-groups:
  - name: "P2P"
    type: select
    proxies: []
rules:
  - RULE-SET,P2P_Domain,P2P
  - RULE-SET,P2P,P2P,no-resolve
  - RULE-SET,P2P_IP,P2P,no-resolve
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  P2P_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/P2P/P2P_Domain.mrs }
  P2P: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/P2P/P2P.yaml }
  P2P_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/P2P/P2P_IP.mrs }
```

## Artifacts

### mrs(ipcidr)

#### P2P_IP.mrs

GitHub: [P2P_IP.mrs](https://github.com/xream/rule/blob/release/P2P/P2P_IP.mrs)
Text: [P2P_IP.txt](https://github.com/xream/rule/blob/release/P2P/P2P_IP.txt)
Source: [STUN.original.yaml](https://github.com/xream/rule/blob/release/P2P/STUN.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/P2P/P2P_IP.mrs
```

### mrs(domain)

#### P2P_Domain.mrs

GitHub: [P2P_Domain.mrs](https://github.com/xream/rule/blob/release/P2P/P2P_Domain.mrs)
Text: [P2P_Domain.txt](https://github.com/xream/rule/blob/release/P2P/P2P_Domain.txt)
Sources: [STUN.original.yaml](https://github.com/xream/rule/blob/release/P2P/STUN.original.yaml), [huya.original.list](https://github.com/xream/rule/blob/release/P2P/huya.original.list), [WebRTC.original.list](https://github.com/xream/rule/blob/release/P2P/WebRTC.original.list)

```text
https://raw.githubusercontent.com/xream/rule/release/P2P/P2P_Domain.mrs
```

### yaml(remaining)

#### P2P.yaml

GitHub: [P2P.yaml](https://github.com/xream/rule/blob/release/P2P/P2P.yaml)
Sources: [WebRTC.original.list](https://github.com/xream/rule/blob/release/P2P/WebRTC.original.list), [P2P.original.yaml](https://github.com/xream/rule/blob/release/P2P/P2P.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/P2P/P2P.yaml
```
