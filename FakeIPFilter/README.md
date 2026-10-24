# FakeIPFilter

Source config: [FakeIPFilter.yaml](https://github.com/xream/rule/blob/main/source/FakeIPFilter/FakeIPFilter.yaml)

## Source Files

| name |description |enabled |type |behavior |format |mihomo |headers |url |path |payload |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
| ShellCrash |  | true | http | classical | text | fake-ip-filter |  | [fake_ip_filter.list](https://raw.githubusercontent.com/juewuy/ShellCrash/refs/heads/dev/public/fake_ip_filter.list) |  |  |

## Mihomo Config

```yaml
dns:
  # other fields
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    - "rule-set:FakeIPFilter_Domain"
rule-anchor:
  github-token-header: &github-token-header { Authorization: ["Bearer <YOUR_GITHUB_TOKEN>"] }
  domain: &domain { type: http, behavior: domain, format: mrs, interval: 86400, header: *github-token-header }
rule-providers:
  FakeIPFilter_Domain: { <<: *domain, url: https://raw.githubusercontent.com/xream/rule/release/FakeIPFilter/FakeIPFilter_Domain.mrs }
```

## Artifacts

### mrs(domain)

#### FakeIPFilter_Domain.mrs

GitHub: [FakeIPFilter_Domain.mrs](https://github.com/xream/rule/blob/release/FakeIPFilter/FakeIPFilter_Domain.mrs)
Text: [FakeIPFilter_Domain.txt](https://github.com/xream/rule/blob/release/FakeIPFilter/FakeIPFilter_Domain.txt)
Source: [ShellCrash.original.list](https://github.com/xream/rule/blob/release/FakeIPFilter/ShellCrash.original.list)

```text
https://raw.githubusercontent.com/xream/rule/release/FakeIPFilter/FakeIPFilter_Domain.mrs
```
