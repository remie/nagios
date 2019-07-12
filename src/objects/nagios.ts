
import { Nagios, Cgi, Resource } from '../types';
import { AbstractNagiosObj, HostObj, HostGroupObj, ObjectType, RequiredFieldValidator } from './index';
import * as cloneDeep from 'lodash.clonedeep';

export abstract class NagiosCfg extends AbstractNagiosObj {

  // ------------------------------------------------------------------------------------------ Properties
  // Contrarity to other objects, NagiosCfg properties can only be set by the decorator,
  // with notable exception of 'cgi' and 'resources'. The output of NagiosCfg, CGI and Resources
  // also differs from all other objects.

  cgi?: Cgi;
  resource?: Resource;

  // ------------------------------------------------------------------------------------------ Constructor

  constructor() {
    super(ObjectType.nagios);
  }

  // ------------------------------------------------------------------------------------------ Getters & Setters

  abstract hosts: Array<HostObj|HostGroupObj>;

  // ------------------------------------------------------------------------------------------ Methods

  get requiredFields(): Array<RequiredFieldValidator> {
    return [];
  }

  toObjectDefinition(): Nagios {
    return cloneDeep(this.$decorator) as Nagios;
  }

  toObject(definition?: { [id: string]: any }) {
    let cfg = '\n';
    definition = definition || this.toObjectDefinition();

    Object.keys(definition).forEach(key => {
      let value = definition[key];
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

}
