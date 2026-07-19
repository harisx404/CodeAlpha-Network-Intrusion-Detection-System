name: Rule Suggestion
description: Propose a new Suricata detection rule
title: "[RULE] "
labels: ["detection-rule"]
assignees: []

---

**What threat should this rule detect?**
Describe the attack, scan, or anomaly (e.g., "Nmap SYN scan", "SQL injection in login form").

**Proposed rule**
If you have a draft signature, paste it here. See `docs/RULE_GUIDE.md` for the rule anatomy.
```text
alert tcp $EXTERNAL_NET any -> $HOME_NET any (msg:"..."; sid:1000000; rev:1;)
```

**Classtype and severity**
Which `classtype` fits (e.g., `web-application-attack`, `trojan-activity`)? This drives the severity mapping in the backend.

**References**
Links to CVEs, ET rule IDs, advisories, or packet captures that justify the rule.

**Additional context**
False-positive risk, expected traffic conditions, or anything else worth noting.
