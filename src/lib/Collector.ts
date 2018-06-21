
import * as path from 'path';
import { CommandObj } from '../objects/command';
import { NagiosCfg, NagiosObj, InheritableNagiosObj, RefObj, ContactObj, ContactGroupObj, HostObj, HostGroupObj, ServiceObj, ServiceGroupObj, TimeperiodObj } from '../objects';
import slugify from 'slugify';

export class Collector {

  private nagios: NagiosCfg;
  private commands = new Map<string, CommandObj>();
  private contacts = new Map<string, ContactObj>();
  private contactgroups = new Map<string, ContactGroupObj>();
  private hosts = new Map<string, HostObj>();
  private hostgroups = new Map<string, HostGroupObj>();
  private services = new Map<string, ServiceObj>();
  private servicegroups = new Map<string, ServiceGroupObj>();
  private timeperiods = new Map<string, TimeperiodObj>();


  constructor(nagios: NagiosCfg) {
    this.nagios = nagios;
  }

  collect(): CollectedObjects {
    this.nagios.hosts.forEach((obj: HostObj|HostGroupObj) => this.collectByObj(obj));

    return {
      commands: this.commands,
      contacts: this.contacts,
      contactgroups: this.contactgroups,
      hosts: this.hosts,
      hostgroups: this.hostgroups,
      services: this.services,
      servicegroups: this.servicegroups,
      timeperiods: this.timeperiods
    };
  }

  private collectByObj(obj: NagiosObj|InheritableNagiosObj);
  private collectByObj(obj: Array<NagiosObj>|Array<InheritableNagiosObj>);
  private collectByObj(obj: any): void {
    if (obj instanceof Array) {
      obj.forEach((item: NagiosObj|InheritableNagiosObj) => this.collectByObj(item));
    } else {

      const references = [];
      let skipProcessing: boolean = true;

      if (obj instanceof CommandObj && !this.commands.has(obj.command_name)) {
        skipProcessing = false;
        this.commands.set(obj.command_name, obj);
        references.push(...obj.references);
      } else if (obj instanceof ContactObj && !this.contacts.has(obj.contact_name)) {
        skipProcessing = false;
        this.contacts.set(obj.contact_name, obj);
        references.push(...obj.references);
      } else if (obj instanceof ContactGroupObj && !this.contactgroups.has(obj.contactgroup_name)) {
        skipProcessing = false;
        this.contactgroups.set(obj.contactgroup_name, obj);
        references.push(...obj.references);
      } else if (obj instanceof HostObj && !this.hosts.has(obj.host_name)) {
        skipProcessing = false;
        this.hosts.set(obj.host_name, obj);
        obj.services.forEach((service) => service.host_name = obj);
        references.push(...obj.references);
      } else if (obj instanceof HostGroupObj && !this.hostgroups.has(obj.hostgroup_name)) {
        skipProcessing = false;
        this.hostgroups.set(obj.hostgroup_name, obj);
        obj.services.forEach((service) => service.hostgroup_name = obj);
        references.push(...obj.references);
      } else if (obj instanceof ServiceObj) {
        let host: HostObj|HostGroupObj;
        let host_name: string;
        if (typeof obj.host_name === 'string') {
          host = this.hosts.get(obj.host_name);
          host_name = host.host_name;
        } else if (typeof obj.hostgroup_name === 'string') {
          host = this.hosts.get(obj.hostgroup_name);
          host_name = obj.hostgroup_name;
        } else if (obj.host_name && obj.host_name instanceof HostObj) {
          host = obj.host_name;
          host_name = host.host_name;
        } else if (obj.hostgroup_name && obj.hostgroup_name instanceof HostGroupObj) {
          host = obj.hostgroup_name;
          host_name = host.hostgroup_name;
        }

        if (!obj.register || host && host.register) {
          if (!obj.name) {
            obj.name = slugify(`${host_name}-${obj.service_description}`, { lower: true, remove: /[$*_+~.,()'"!\:@&]/g });
          }

          if (!this.services.has(obj.name)) {
            skipProcessing = false;
            this.services.set(obj.name, obj);
            references.push(...obj.references);
          }
        }
      } else if (obj instanceof ServiceGroupObj && !this.servicegroups.has(obj.servicegroup_name)) {
        skipProcessing = false;
        this.servicegroups.set(obj.servicegroup_name, obj);
        references.push(...obj.references);
      } else if (obj instanceof TimeperiodObj && !this.timeperiods.has(obj.timeperiod_name)) {
        skipProcessing = false;
        this.timeperiods.set(obj.timeperiod_name, obj);
        references.push(...obj.references);
      }

      if (!skipProcessing) {
        // Get objects from properties
        const proto = Object.getPrototypeOf(obj);
        const properties = Object.getOwnPropertyNames(proto);
        const keys = [ ...Object.keys(obj), ...properties ];

        keys.filter((key: string) => key !== 'constructor' && !(/^_/).test(key))
          .forEach((key: string) => {
            if (obj[key] instanceof Array || typeof obj[key] === 'object') {
              this.collectByObj(obj[key]);
            }
          });
      }

      // Get refeferenced objects
      references.forEach((ref: RefObj) => this.collectByObj(ref.instance));
    }
  }

  static sortByName<T>(map: Map<string, T>): Map<string, T> {
    const result = new Map<string, T>();
    const keys = Array.from(map.keys()).sort();
    keys.forEach((key) => {
      result.set(key, map.get(key));
    });
    return result;
  }

}

export interface CollectedObjects {
  commands: Map<string, CommandObj>;
  contacts: Map<string, ContactObj>;
  contactgroups: Map<string, ContactGroupObj>;
  hosts: Map<string, HostObj>;
  hostgroups: Map<string, HostGroupObj>;
  services: Map<string, ServiceObj>;
  servicegroups: Map<string, ServiceGroupObj>;
  timeperiods: Map<string, TimeperiodObj>;
}