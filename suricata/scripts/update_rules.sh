#!/bin/bash
echo "Updating Suricata rules..."
# Fetch ET Open rules
curl -sL https://rules.emergingthreats.net/open/suricata/emerging.rules.tar.gz | tar -xz -C /etc/suricata/
echo "Rule update complete. Reloading Suricata..."
suricatasc -c reload-rules
