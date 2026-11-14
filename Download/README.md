# Download

Source config: [Download.yaml](https://github.com/xream/rule/blob/main/source/Download/Download.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| Download | Download | true | http | classical | yaml | rules |  | [Download.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Download/Download.yaml) |  |  |

## Mihomo Config

```yaml
proxy-groups:
  - name: "Download"
    type: select
    proxies: []
rules:
  - RULE-SET,Download_Domain,Download
  - RULE-SET,Download,Download,no-resolve
  - RULE-SET,Download_IP,Download,no-resolve # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  ip: &ip { type: http, behavior: ipcidr, format: mrs, interval: 86400, header: *github-token-header }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
  yaml: &yaml { type: http, behavior: classical, format: yaml, interval: 86400, header: *github-token-header }
rule-providers:
  Download_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/Download/Download_Domain.mrs }
  Download: { <<: *yaml, url: https://raw.githubusercontent.com/xream/rule/release/Download/Download.yaml }
  Download_IP: { <<: *ip, url: https://raw.githubusercontent.com/xream/rule/release/Download/Download_IP.mrs } # placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
```

## Artifacts

### mrs(ipcidr)

#### Download_IP.mrs

GitHub: [Download_IP.mrs](https://github.com/xream/rule/blob/release/Download/Download_IP.mrs)
Text: [Download_IP.txt](https://github.com/xream/rule/blob/release/Download/Download_IP.txt)
Placeholder: upstream currently has no ipcidr rules; contains 203.0.113.1/32 only
Source: [Download.original.yaml](https://github.com/xream/rule/blob/release/Download/Download.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Download/Download_IP.mrs
```

### mrs(domain)

#### Download_Domain.mrs

GitHub: [Download_Domain.mrs](https://github.com/xream/rule/blob/release/Download/Download_Domain.mrs)
Text: [Download_Domain.txt](https://github.com/xream/rule/blob/release/Download/Download_Domain.txt)
Source: [Download.original.yaml](https://github.com/xream/rule/blob/release/Download/Download.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Download/Download_Domain.mrs
```

### yaml(remaining)

#### Download.yaml

GitHub: [Download.yaml](https://github.com/xream/rule/blob/release/Download/Download.yaml)
Source: [Download.original.yaml](https://github.com/xream/rule/blob/release/Download/Download.original.yaml)

```text
https://raw.githubusercontent.com/xream/rule/release/Download/Download.yaml
```
