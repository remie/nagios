'use strict';

// ------------------------------------------------------------------------------------------ Dependencies

import del from 'del';
import * as path from 'path';
import * as fs from 'fs-extra';
import { ExtendableNagiosObj } from './objects/abstract';
import { Timeperiod, Contact, ContactGroup } from './types';
import { RefObj, ObjectType, ContactObj, ContactGroupObj, HostObj, HostGroupObj, NagiosCfg, NagiosObj, InheritableNagiosObj, ServiceObj, ServiceGroupObj, TimeperiodObj } from './objects';
import CommandObj from './objects/command';
import slugify from 'slugify';

// ------------------------------------------------------------------------------------------ Module exports

export default class Compiler {

  private outputDir: string;
  private filepath: string;

  private commands: Array<NagiosObj> = [];
  private contacts: Array<ContactObj> = [];
  private contactgroups: Array<ContactGroupObj> = [];
  private hosts: Array<HostObj> = [];
  private hostgroups: Array<HostGroupObj> = [];
  private nagios: NagiosCfg;
  private refs: Array<NagiosObj> = [];
  private services: Array<ServiceObj> = [];
  private servicegroups: Array<ServiceGroupObj> = [];
  private timeperiods: Array<TimeperiodObj> = [];

  constructor(entryPoint: EntryPoint, outputDir: string = './config') {
    this.nagios = <NagiosCfg>entryPoint.nagios;
    this.outputDir = path.join(entryPoint.basedir, outputDir);
    this.filepath = entryPoint.filepath;
  }

  async compile(): Promise<void> {
    await this.collect();
    await this.prepareCommands();
    await this.prepareContacts();
    // await this.prepareContactGroups();
    // await this.prepareHostGroups();
    await this.prepareHosts();
    await this.prepareServices();
    await this.prepareTimeperiods();
    await this.persist();
  }

  async collect(): Promise<void> {

    // Collect commands
    this.commands.push(this.getCommand());

    // Collect hostgroups
    this.nagios.hosts
      .filter((host: HostObj & ExtendableNagiosObj) => host.hostgroups)
      .forEach((host: HostObj & ExtendableNagiosObj) => this.hostgroups.push(...host.hostgroups));

    // Collect hosts
    this.nagios.hosts.forEach((host: HostObj) => this.hosts.push(host));
    this.hostgroups.forEach((hostgroup: HostGroupObj) => this.hosts.push(...hostgroup.hosts));

    // Collect services
    this.nagios.hosts.forEach((host: HostObj, hostIndex: number) => {
      host.services.forEach((service: ServiceObj, serviceIndex: number) => {
        service.configuration.host_name = host.configuration.host_name;
        if (!service.configuration.check_command || service.configuration.check_command === '') {
          service.configuration.check_command = `nagios-cli!hosts[${hostIndex}].services[${serviceIndex}].check_command`;
        }
        this.services.push(service);
      });
    });

    // Collect contacts (from hosts, services, contactgroups)
    this.nagios.hosts.forEach((host: HostObj) => {
      host.contacts.filter((contact: ContactObj|ContactGroupObj) => (contact instanceof ContactObj))
        .forEach((contact: ContactObj) => this.contacts.push(contact));
      host.contacts.filter((contact: ContactObj|ContactGroupObj) => (contact instanceof ContactGroupObj))
        .forEach((contact: ContactGroupObj) => contact.members.filter((member: ContactObj|ContactGroupObj) => (member instanceof ContactObj))
          .forEach((member: ContactObj) => this.contacts.push(member)));
    });

    // Gather references from objects
    this.refs = this.refs.concat(...this.nagios.refs);
    this.refs = this.refs.concat(...this.contactgroups.filter((obj: NagiosObj) => obj.refs).map((obj: NagiosObj) => obj.refs));
    this.refs = this.refs.concat(...this.contacts.filter((obj: NagiosObj) => obj.refs).map((obj: NagiosObj) => obj.refs));
    this.refs = this.refs.concat(...this.hostgroups.filter((obj: NagiosObj) => obj.refs).map((obj: NagiosObj) => obj.refs));
    this.refs = this.refs.concat(...this.hosts.filter((obj: NagiosObj) => obj.refs).map((obj: NagiosObj) => obj.refs));
    this.refs = this.refs.concat(...this.servicegroups.filter((obj: NagiosObj) => obj.refs).map((obj: NagiosObj) => obj.refs));
    this.refs = this.refs.concat(...this.services.filter((obj: NagiosObj) => obj.refs).map((obj: NagiosObj) => obj.refs));
    this.refs = this.refs.concat(...this.timeperiods.filter((obj: NagiosObj) => obj.refs).map((obj: NagiosObj) => obj.refs));

    // Process object references
    this.refs.forEach((obj: RefObj) => {
      switch (obj.type) {
        case 'contact':
          this.contacts.push(<ContactObj>obj.instance);
          break;
        case 'contactgroup':
          this.contactgroups.push(<ContactGroupObj>obj.instance);
          break;
        case 'hostgroup':
          this.hostgroups.push(<HostGroupObj>obj.instance);
          break;
        case 'host':
          this.hosts.push(<HostObj>obj.instance);
          break;
        case 'servicegroup':
          this.servicegroups.push(<ServiceGroupObj>obj.instance);
          break;
        case 'service':
          this.services.push(<ServiceObj>obj.instance);
          break;
        case 'timeperiod':
          this.timeperiods.push(<TimeperiodObj>obj.instance);
          break;
      }
    });

  }

  async prepareCommands(): Promise<void> {
    this.registerCfgFile('commands/nagios-cli.cfg');
  }

  /*****************************************************
  Contacts can only exist on host & service objects
  ******************************************************/
  async prepareContacts(): Promise<void> {
    this.contacts = this.dedupe('contact_name', this.contacts) as Array<ContactObj>;

    // Add the definition to the Nagios CFG
    this.contacts.forEach((contact: ContactObj, index: number) => {

      if (!contact.configuration.service_notification_commands || contact.configuration.service_notification_commands === '') {
        contact.configuration.service_notification_commands = `nagios-cli!hosts[${index}].serviceNotificationCommand`;
      }

      if (!contact.configuration.host_notification_commands || contact.configuration.host_notification_commands === '') {
        contact.configuration.host_notification_commands = `nagios-cli!hosts[${index}].hostNotificationCommand`;
      }

      const filename = `${contact.configuration.contact_name}.cfg`;
      this.registerCfgFile(`contacts/${filename}`);
    });
  }

  /*****************************************************
  Contactgroups can only exist on host & service objects
  ******************************************************/
  async prepareContactGroups(): Promise<void> {
  }

  async prepareHostGroups(): Promise<void> {
  }

  async prepareHosts(): Promise<void> {
    this.hosts = this.dedupe('host_name', this.hosts) as Array<HostObj>;

    // Add the definition to the Nagios CFG
    this.hosts.forEach((host: HostObj, index: number) => {
      const contacts: Set<string> = new Set();
      const contactGroups: Set<string> = new Set();
      host.contacts.forEach((contact: ContactObj | ContactGroupObj) => {
        if (contact instanceof ContactObj) {
          contacts.add(contact.configuration.contact_name);
        } else if (contact instanceof ContactGroupObj) {
          contactGroups.add(contact.configuration.contactgroup_name);
        }
      });

      if (contacts.size <= 0 && contactGroups.size <= 0) {
        throw new Error(`Host ${host.configuration.host_name} requires at least one contact or contact group`);
      }

      host.configuration.contacts = Array.from(contacts).join(',');
      host.configuration.contact_groups = Array.from(contactGroups).join(',');
      if (host.configuration.contacts === '') delete host.configuration.contacts;
      if (host.configuration.contact_groups === '') delete host.configuration.contact_groups;

      const filename = `${host.configuration.host_name}.cfg`;
      this.registerCfgFile(`hosts/${filename}`);

      if (!host.configuration.check_command || host.configuration.check_command === '') {
        host.configuration.check_command = `nagios-cli!hosts[${index}].check`;
      }

    });
  }

  async prepareServices(): Promise<void> {
    this.services = this.services.map((service: ServiceObj) => {
      service.configuration.name = service.configuration.name || slugify(`${service.configuration.host_name}-${service.configuration.service_description}`, { lower: true, remove: /[$*_+~.,()'"!\:@&]/g });
      return service;
    });
    this.services = this.dedupe('name', this.services) as Array<ServiceObj>;

    this.services.forEach((service: ServiceObj, index: number) => {
      this.registerCfgFile(`services/${service.configuration.name}.cfg`);
    });
  }

  async prepareTimeperiods(): Promise<void> {
    this.timeperiods = this.dedupe('timeperiod_name', this.timeperiods) as Array<TimeperiodObj>;
    this.timeperiods.forEach((timeperiod: TimeperiodObj, index: number) => {
      this.registerCfgFile(`timeperiods/${timeperiod.configuration.timeperiod_name}.cfg`);
    });
  }

  private async persist(): Promise<any> {
    // Prepare directory structure
    await fs.mkdirs(this.outputDir);
    await fs.mkdirs(path.join(this.outputDir, 'commands'));
    await fs.mkdirs(path.join(this.outputDir, 'contacts'));
    await fs.mkdirs(path.join(this.outputDir, 'hosts'));
    await fs.mkdirs(path.join(this.outputDir, 'hostgroups'));
    await fs.mkdirs(path.join(this.outputDir, 'services'));
    await fs.mkdirs(path.join(this.outputDir, 'servicegroups'));
    await fs.mkdirs(path.join(this.outputDir, 'timeperiods'));

    // Processs object definitions
    // Use promises to speed up the processing
    const promises: Array<Promise<any>> = [];
    promises.push(...this.contacts.map((contact: ContactObj) => fs.writeFile(path.join(this.outputDir, `contacts/${contact.configuration.contact_name}.cfg`), this.toObject(contact), 'utf-8')));
    promises.push(...this.contactgroups.map((contactgroup: ContactGroupObj) => fs.writeFile(path.join(this.outputDir, `contactgroupss/${contactgroup.configuration.contactgroup_name}.cfg`), this.toObject(contactgroup), 'utf-8')));
    promises.push(...this.hosts.map((host: HostObj) => fs.writeFile(path.join(this.outputDir, `hosts/${host.configuration.host_name}.cfg`), this.toObject(host), 'utf-8')));
    promises.push(...this.hostgroups.map((hostgroup: HostGroupObj) => fs.writeFile(path.join(this.outputDir, `hosts/${hostgroup.configuration.hostgroup_name}.cfg`), this.toObject(hostgroup), 'utf-8')));
    promises.push(...this.services.map((service: ServiceObj) => fs.writeFile(path.join(this.outputDir, `services/${service.configuration.name}.cfg`), this.toObject(service), 'utf-8')));
    promises.push(...this.timeperiods.map((timeperiod: TimeperiodObj) => fs.writeFile(path.join(this.outputDir, `timeperiods/${timeperiod.configuration.timeperiod_name}.cfg`), this.toObject(timeperiod), 'utf-8')));

    // Process command
    const binPath = path.resolve(path.join(process.cwd(), './node_modules/.bin/nagios-cli'));
    promises.push(fs.writeFile(path.join(this.outputDir, `commands/nagios-cli.cfg`), `
define command {
  command_name  nagios-cli
  command_line /usr/bin/env node ${binPath} execute -f ${this.filepath} $ARG1$
}`, 'utf-8'));

    // Sort the inclusion of CFG files
    this.nagios.configuration.cfg_file.sort((a, b) => {
      let result;
      if (a.indexOf('/') < 0 && b.indexOf('/') < 0) return 0;
      if (a.indexOf('/') < 0 && b.indexOf('/') >= 0) return 1;
      if (a.indexOf('/') >= 0 && b.indexOf('/') < 0) return -1;

      if (a.indexOf('/') >= 0 && b.indexOf('/') >= 0) {
        switch (a.substr(0, a.indexOf('/'))) {
          case 'commands':
          case 'contacts':
          case 'contactgroups':
          case 'timeperiods':
           return -1;
         default:
           return 1;
        }
      }
    });

    // Process resource file
    if (this.nagios.resource) {
      promises.push(fs.writeFile(path.join(this.outputDir, `resource.cfg`), this.toCfg(this.nagios.resource), 'utf-8'));
      this.nagios.configuration.resource_file = 'resource.cfg';
    }

    // Process CGI file
    if (this.nagios.cgi) {
      promises.push(fs.writeFile(path.join(this.outputDir, `cgi.cfg`), this.toCfg(this.nagios.cgi), 'utf-8'));
    }

    // Process nagios configuration
    promises.push(fs.writeFile(path.join(this.outputDir, `nagios.cfg`), this.toCfg(this.nagios.configuration), 'utf-8'));
    return Promise.all(promises);
  }

  private toCfg(configuration: { [id: string]: any }) {
    let cfg = '\n';
    Object.keys(configuration).forEach(key => {
      let value = configuration[key];
      if (value instanceof Array) {
        value.forEach(item => cfg += `${key}=${item}\n`);
      } else if (typeof value === 'boolean') {
        value = value ? '1' : '0';
        cfg += `${key}=${value}\n`;
      } else {
        cfg += `${key}=${value}\n`;
      }
    });
    return cfg;
  }

  private toObject(instance: NagiosObj|InheritableNagiosObj) {
    let cfg = '\n';
    cfg += `define ${instance.objectType} {\n`;

    Object.keys(instance.configuration).forEach(key => {
      let value = instance.configuration[key];
      if (value instanceof Array) {
        value = value.join(',');
      } else if (typeof value === 'boolean') {
        value = value ? '1' : '0';
      }
      cfg += `\t${key}\t${value}\n`;
    });

    cfg += '\n}';
    return cfg;
  }

  private dedupe(key: string, items: Array<NagiosObj>): Array<NagiosObj> {
    const names: Array<string> = [];
    return items.filter((obj: NagiosObj) => {
      const name = obj.configuration[key];
      if (names.indexOf(name) >= 0) return false;
      names.push(name);
      return true;
    });
  }

  private registerCfgFile(filename: string) {
    this.nagios.configuration.cfg_file = this.nagios.configuration.cfg_file || [];
    if (this.nagios.configuration.cfg_file.indexOf(filename) < 0) {
      this.nagios.configuration.cfg_file.push(filename);
    }
  }

  private getCommand(): NagiosObj {
    const binPath = path.resolve(path.join(process.cwd(), 'bin/nagios-cli'));
    const command = new CommandObj();
    command.configuration['command_name'] = 'nagios-cli';
    command.configuration['command_line'] = '/usr/bin/env node ${binPath} execute -f ${this.filepath} $ARG1$';
    return command;
  }

  static getEntryPoint(file?: string): EntryPoint {
    try {
      if (!file) {
        const descriptor = require(path.join(process.cwd(), './package.json'));
        file = descriptor.main;
      }

      if (file) {
        let entryPoint = require(path.resolve(file));
        if (entryPoint) {
          return {
            nagios: entryPoint.default ? new entryPoint.default() : new entryPoint(),
            filepath: path.resolve(file),
            basedir: path.dirname(path.resolve(path.join(path.resolve(file), '../')))
          };
        }
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

// ------------------------------------------------------------------------------------------ Types & Interfaces

export type EntryPoint = {
  nagios: NagiosCfg,
  filepath: string,
  basedir: string
};
