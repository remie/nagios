#!/bin/bash

BASEDIR=`pwd`;

rm -rf $BASEDIR/config
npm run compile;
docker run --rm -v "$BASEDIR/config/:/config" remie/docker-nagios /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg