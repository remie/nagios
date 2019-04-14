#!/bin/bash

BASEDIR=`pwd`;

rm -rf $BASEDIR/config
npm run build;
(cd example && npm install && npm link @remie/nagios-cli && npm run build)
node ./bin/nagios-cli compile -f ./example/build/
docker run --rm -v "$BASEDIR/config/:/config" remie/docker-nagios /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg