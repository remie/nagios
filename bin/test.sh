#!/bin/bash

BASEDIR=`pwd`;

rm -rf $BASEDIR/config
npm run build;
(cd example && ./node_modules/.bin/gulp)
node ./bin/nagios-cli compile -f ./example/build/
docker run --rm -v "$BASEDIR/config/:/config" remie/docker-nagios /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg
docker run --rm --name nagios -v "$BASEDIR/config/:/config" -p 5000:80 remie/docker-nagios