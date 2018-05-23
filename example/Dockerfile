FROM remie/docker-nagios:1.2.0

## Update the package manager
RUN yum -y update; yum clean all;

## Installing NodeJS
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
RUN yum -y install nodejs

## Set workdir
WORKDIR /opt/nagios/

## Install Nagios CLI
RUN npm install -g @remie/nagios-cli@latest

## Copy & install Nagios configuration
COPY package.json package-lock.json ./
RUN npm install && npm install @remie/nagios-cli@latest

## Copy sources
COPY ./src ./src
COPY ./gulpfile.js ./tsconfig.json ./tslint.json ./

## Compile Nagios configuration
RUN npm run build; \
	nagios-cli compile -f ./build/index.js;

RUN	rm -rf /usr/local/nagios/etc; \
	cp -R config /usr/local/nagios/etc; 
	#/usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg;
