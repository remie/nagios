FROM remie/docker-nagios:1.2.0

## Update the package manager & install build essentials
RUN yum -y update; yum clean all; yum -y groupinstall 'Development Tools';

## Installing NodeJS
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
RUN yum -y install nodejs

## Set workdir
WORKDIR /opt/nagios/

## Copy & install Nagios configuration
COPY package.json package-lock.json ./
RUN npm install

## Copy sources
COPY ./src ./src
COPY ./gulpfile.js ./tsconfig.json ./tslint.json ./htpasswd.users ./start.sh ./

CMD ["/opt/nagios/start.sh"]