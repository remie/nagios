
import { ObjectDefinition, InheritableObjectDefinition } from '../types/';
import * as cloneDeep from 'lodash.clonedeep';

export type NagiosClass<T> = { new (...args: any[]): T & NagiosObj } & NagiosObj;
export type InheritableNagiosClass<T> = { new (...args: any[]): T & InheritableNagiosObj } & InheritableNagiosObj;

export interface NagiosObj {
  objectType?: ObjectType;
  configuration?: ObjectDefinition;
  refs?: Array<NagiosObj|InheritableNagiosObj>;
}

export abstract class AbstractNagiosObj implements NagiosObj {
  objectType: ObjectType;
  configuration: ObjectDefinition;
  refs?: Array<NagiosObj>;

  constructor() {
    this.configuration = Object.assign({}, cloneDeep(this.configuration || {}), cloneDeep((<any>this)._decorator || {}));
  }
}

export interface InheritableNagiosObj extends NagiosObj {
  name: string;
  configuration?: InheritableObjectDefinition;
}

export abstract class AbstractInheritableNagiosObj extends AbstractNagiosObj implements InheritableNagiosObj {
  configuration: InheritableObjectDefinition;

  constructor() {
    super();
  }

  get name(): string {
    return this.configuration.name;
  }
}

export interface ExtendableNagiosObj {
  [key: string]: any;
}

export enum ObjectType {
  contact = 'contact',
  contactgroup = 'contactgroup',
  host = 'host',
  hostgroup = 'hostgroup',
  nagios = 'nagios',
  service = 'service',
  servicegroup = 'servicegroup',
  timeperiod = 'timeperiod'
}