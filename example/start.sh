#!/bin/bash

## Install Nagios CLI
npm install -g @remie/nagios-cli@latest

## Compile Nagios configuration
npm run compile

## Copy Nagios configuration & validate
rm -rf /usr/local/nagios/etc;
cp -R config /usr/local/nagios/etc;
cp -R htpasswd.users /usr/local/nagios/etc/htpasswd.users;
/usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg;

## Only run nagios if the configuration is correct
if [ $? -eq 0 ]; then
  /bin/bash /opt/start.sh
else
  echo "You have errors in your Nagios configuration";
  tail -f /dev/null
fi