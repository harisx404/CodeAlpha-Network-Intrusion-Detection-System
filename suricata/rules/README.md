# Suricata Rules

Custom detection signatures for the NIDS engine. Only `custom.rules` is loaded at
runtime, as declared under `rule-files` in `suricata/config/suricata.yaml`.

Each signature uses a SID from the local range (`1000000+`) reserved by Suricata
for user-defined rules, so they never collide with Emerging Threats or ruleset
updates. The current signatures and their SIDs:

| SID     | Detection                                  |
| ------- | ------------------------------------------ |
| 1000001 | SSH brute force (thresholded)              |
| 1000002 | SQL injection — `OR 1=1` payload           |
| 1000003 | SQL injection — `UNION SELECT` payload     |
| 1000004 | Nmap OS detection probe                    |
| 1000005 | Log4Shell (CVE-2021-44228) JNDI lookup     |
| 1000006 | Cross-site scripting probe                 |
| 1000007 | Reverse shell (`/bin/bash` outbound)       |
| 1000008 | DNS exfiltration — large TXT query         |
| 1000009 | ICMP ping sweep (thresholded)              |
| 1000010 | Directory traversal (`/etc/passwd`)        |

When adding a rule, use the next free SID in the `1000000+` range, bump the `rev`
field on any edit, and validate the file with `suricata -T -c suricata.yaml`
before deploying. See `docs/RULE_GUIDE.md` for the full authoring workflow.
