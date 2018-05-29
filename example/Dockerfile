FROM remie/docker-nagios:1.2.0

## Update the package manager & install build essentials
RUN yum -y update; yum clean all; yum -y groupinstall 'Development Tools';

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
COPY ./gulpfile.js ./tsconfig.json ./tslint.json ./htpasswd.users ./start.sh ./

CMD ["/opt/nagios/start.sh"]