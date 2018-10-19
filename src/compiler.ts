'use strict';

// ------------------------------------------------------------------------------------------ Dependencies

import del from 'del';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as cloneDeep from 'lodash.clonedeep';
import slugify from 'slugify';

import { Nagios, Timeperiod, Contact, ContactGroup } from './types';
import { RefObj, ObjectType, ContactObj, ContactGroupObj, HostObj, HostGroupObj, NagiosCfg, NagiosObj, InheritableNagiosObj, ServiceObj, ServiceGroupObj, TimeperiodObj, AbstractNagiosObj } from './objects';
import { NagiosCommand } from './lib/NagiosCommand';
import { CommandObj } from './objects/command';

import { Collector, CollectedObjects } from './lib/Collector';

// ------------------------------------------------------------------------------------------ Module exports

export default class Compiler {

  private outputDir: string;
  private filepath: string;

  private nagios: NagiosCfg;

  constructor(entryPoint: EntryPoint, outputDir: string = './config') {
    this.nagios = <NagiosCfg>entryPoint.nagios;
    this.outputDir = path.join(entryPoint.basedir, outputDir);
    this.filepath = entryPoint.filepath;
  }

  async compile(): Promise<void> {
    const objects = await this.collect();
    await this.persist(objects);
  }

  async collect(): Promise<CollectedObjects> {
    const collector = new Collector(this.nagios);
    const objects = collector.collect();

    // Add the custom Nagios CLI command
    const nagiosCommand = new NagiosCommand();
    const binPath = path.resolve(path.join(process.cwd(), './node_modules/.bin/nagios-cli'));
    nagiosCommand.command_name = 'nagios-cli';
    nagiosCommand.command_line = `/usr/bin/env node ${binPath} execute -f ${this.filepath} "$ARG1$"`;
    objects.commands.set('nagios-cli', nagiosCommand);

    // Add all the objects to the cfg_file property in Nagios CFG
    Collector.sortByName(objects.commands).forEach((obj: CommandObj) => this.registerCfgFile(`commands/${obj.command_name}.cfg`));
    Collector.sortByName(objects.timeperiods).forEach((obj: TimeperiodObj) => this.registerCfgFile(`timeperiods/${obj.timeperiod_name}.cfg`));
    Collector.sortByName(objects.contacts).forEach((obj: ContactObj) => this.registerCfgFile(`contacts/${obj.contact_name}.cfg`));
    Collector.sortByName(objects.contactgroups).forEach((obj: ContactGroupObj) => this.registerCfgFile(`contactgroups/${obj.contactgroup_name}.cfg`));
    Collector.sortByName(objects.hostgroups).forEach((obj: HostGroupObj) => this.registerCfgFile(`hostgroups/${obj.hostgroup_name}.cfg`));
    Collector.sortByName(objects.hosts).forEach((obj: HostObj) => this.registerCfgFile(`hosts/${obj.host_name}.cfg`));
    Collector.sortByName(objects.servicegroups).forEach((obj: ServiceGroupObj) => this.registerCfgFile(`servicegroups/${obj.servicegroup_name}.cfg`));
    Collector.sortByName(objects.services).forEach((obj: ServiceObj) => this.registerCfgFile(`services/${obj.name}.cfg`));

    return objects;
  }

  private async persist(objects: CollectedObjects): Promise<void> {
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
    objects.commands.forEach((command: CommandObj) => promises.push(fs.writeFile(path.join(this.outputDir, `commands/${command.command_name}.cfg`), command.toObject(), 'utf-8')));
    objects.contacts.forEach((contact: ContactObj) => promises.push(fs.writeFile(path.join(this.outputDir, `contacts/${contact.contact_name}.cfg`), contact.toObject(), 'utf-8')));
    objects.contactgroups.forEach((contactgroup: ContactGroupObj) => promises.push(fs.writeFile(path.join(this.outputDir, `contactgroupss/${contactgroup.contactgroup_name}.cfg`), contactgroup.toObject(), 'utf-8')));
    objects.hosts.forEach((host: HostObj) => promises.push(fs.writeFile(path.join(this.outputDir, `hosts/${host.host_name}.cfg`), host.toObject(), 'utf-8')));
    objects.hostgroups.forEach((hostgroup: HostGroupObj) => promises.push(fs.writeFile(path.join(this.outputDir, `hostgroups/${hostgroup.hostgroup_name}.cfg`), hostgroup.toObject(), 'utf-8')));
    objects.services.forEach((service: ServiceObj) => promises.push(fs.writeFile(path.join(this.outputDir, `services/${service.name}.cfg`), service.toObject(), 'utf-8')));
    objects.servicegroups.forEach((servicegroup: ServiceGroupObj) => promises.push(fs.writeFile(path.join(this.outputDir, `servicegroups/${servicegroup.servicegroup_name}.cfg`), servicegroup.toObject(), 'utf-8')));
    objects.timeperiods.forEach((timeperiod: TimeperiodObj) => promises.push(fs.writeFile(path.join(this.outputDir, `timeperiods/${timeperiod.timeperiod_name}.cfg`), timeperiod.toObject(), 'utf-8')));

    // Process resource file
    if (this.nagios.resource) {
      promises.push(fs.writeFile(path.join(this.outputDir, `resource.cfg`), this.nagios.toObject(this.nagios.resource), 'utf-8'));
      (<Nagios>this.nagios.$decorator).resource_file = 'resource.cfg';
    }

    // Process CGI file
    if (this.nagios.cgi) {
      promises.push(fs.writeFile(path.join(this.outputDir, `cgi.cfg`), this.nagios.toObject(this.nagios.cgi), 'utf-8'));
    }

    // Process nagios configuration
    promises.push(fs.writeFile(path.join(this.outputDir, `nagios.cfg`), this.nagios.toObject(), 'utf-8'));

    // Wait for all files to be written
    await Promise.all(promises);
  }

  private registerCfgFile(filename: string) {
    (<Nagios>this.nagios.$decorator).cfg_file = (<Nagios>this.nagios.$decorator).cfg_file || [];
    if ((<Nagios>this.nagios.$decorator).cfg_file.indexOf(filename) < 0) {
      (<Nagios>this.nagios.$decorator).cfg_file.push(filename);
    }
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
