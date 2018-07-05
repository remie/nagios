# Nagios Core + Docker + TypeScript = 🤔😊😍

The goal of this project is to cross the bridge between IT operations staff that are using Nagios for systems monitoring and developers that create the applications that need monitoring. 

In my entire professional life, I've never seen any developer actively contributing to a Nagios configuration. To me, that does not make sense as systems and application monitoring should be an integral part of the development cycle. As such, this should be a shared responsibility between IT operations staff and developers.

To accomplish this, we need to make sure that developers actually understand the Nagios configuration and feel comfortable contributing to it. What better way to do this than to turn Nagios configuration development into the same experience as developing any other application by using a present day technology stack and the same development best practices they are accustomed to.

That technology stack ended up being NodeJS+TypeSript, a custom CLI and Nagios running on Docker, hence the project title!

The project enables developers to run `npm test` and `npm start` like they would with any other application and have it validate the Nagios configuration and start a Nagios instance respectively. Although the project is still in BETA, that goal has been met.

## Getting started

### Prerequisites

In order to start creating your Nagios configuration using TypeScript, you will need to install the following prerequisites:

- NodeJS 6.4+
- Docker

### Installation

The best way to start is to install the NPM package globally:

```
npm install -g @remie/nagios-cli
```

Afterwards, create a new folder in your workspace (e.g. `~/my-nagios-project/`) and type:

```
cd ~/my-nagios-project
nagios-cli init
```

This will copy an example project which you can use to start creating your own Nagios configuration with hosts, host groups and services. 

If you run `npm start` you will be able to see the outcome of the example project. It will start Nagios which will be accessible from `http://localhost:8000/nagios` with default username `nagiosadmin` and password `nagiosadmin`.

If you want to start creating your own object definitions, look at the [Decorators & Interfaces](https://github.com/remie/nagios/wiki/Decorators-&-interfaces) and [Object classes](https://github.com/remie/nagios/wiki/Object-classes) pages.

## 🎉🎉 Acknowledgements 🎉🎉
A big shoutout to the development team of [Guidion](https://guidion.com), which served as a guinee pig for this project. They provided real-life examples, good discussions on architecture and a clear direction on what a developer would expect out of working with Nagios.

Like any other tech company, they are always looking for good people. If you fancy working in an inspiring environment that incubated this project, check out [their career site](https://werkenbijguidion.com) (sorry, dutch site only).


<p align="center">
<img src="http://youtransfer.io/assets/holland.png" alt="Founded in Holland" width="150" /><br />
<a href="https://www.iamsterdam.com/en/business/startupamsterdam">Made in Amsterdam</a> with ♥<br /><br />
Special thanks to <br />
<a href="https://guidion.com"><img src="https://cdn.guidion.com/guidion-nl/guidion_logo.png" width="100px"></a>
</p>
