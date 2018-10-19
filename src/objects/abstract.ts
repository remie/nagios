'use strict';

// ------------------------------------------------------------------------------------------ Dependencies

import { ObjectDefinition, InheritableObjectDefinition } from '../types/';
import { RefObj, ContactObj, ContactGroupObj, HostObj, HostGroupObj, ServiceObj, ServiceGroupObj, TimeperiodObj } from '../objects';
import * as cloneDeep from 'lodash.clonedeep';

// ------------------------------------------------------------------------------------------ Classes

export abstract class AbstractNagiosObj implements NagiosObj {
  readonly $decorator?: ObjectDefinition;
  readonly $references?: Array<RefObj>;
  readonly $objectType: ObjectType;

  constructor(objectType: ObjectType) {
    this.$objectType = objectType;

    // Copy the decorator properties to the object
    for (let key in this.$decorator) {
      this[key] = this.$decorator[key];
    }
  }

  abstract get requiredFields(): Array<RequiredFieldValidator>;

  validate(): Array<string> {
    return this.requiredFields
      .filter((validator: RequiredFieldValidator) => !validator.validate(this))
      .map((validator: RequiredFieldValidator) => validator.toString());
  }

  get references(): Array<RefObj> {
    const references: Array<RefObj> = [];

    // Include any decorator references (@Include / @Use)
    if (this.$references) {
      references.push(...this.$references);
    }

    // Get references from properties
    const proto = Object.getPrototypeOf(this);
    const properties = Object.getOwnPropertyNames(proto);
    const keys = [ ...Object.keys(this), ...properties ];

    keys.filter((key: string) => key !== 'constructor' && !key.startsWith('$'))
      .forEach((key: string) => {
        if (this[key] instanceof Array) {
          references.push(...this[key].map((instance) => new RefObj(instance)));
        } else if (this[key] instanceof AbstractNagiosObj) {
          references.push(new RefObj(this[key]));
        }
      });

    return references;
  }

  toObjectDefinition(): ObjectDefinition {
    const definition: ObjectDefinition = {};

    // Get references from properties
    const proto = Object.getPrototypeOf(this);
    const properties = Object.getOwnPropertyNames(proto);
    const keys = [ ...Object.keys(this), ...properties ];

    keys.filter((key: string) => key !== 'constructor' && !key.startsWith('$'))
      .forEach((key: string) => {
        if (this[key] instanceof Array) {
          definition[key] = this[key].map((obj: AbstractNagiosObj) => this.getObjName(obj)).join(',');
        } else if (this[key] instanceof AbstractNagiosObj) {
          definition[key] = this.getObjName(this[key]);
        } else {
          definition[key] = this[key];
        }
      });
    return definition;
  }

  toObject(): string {
    let cfg = '\n';
    cfg += `define ${this.$objectType} {\n`;

    const definition: ObjectDefinition = this.toObjectDefinition();
    Object.keys(definition).forEach((key) => {
      let value = definition[key];
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

  protected getObjName(obj: AbstractNagiosObj) {
    if (obj instanceof ContactObj) {
      return (<ContactObj>obj).contact_name;
    } else if (obj instanceof ContactGroupObj) {
      return (<ContactGroupObj>obj).contactgroup_name;
    } else if (obj instanceof HostObj) {
      return (<HostObj>obj).host_name;
    } else if (obj instanceof HostGroupObj) {
      return (<HostGroupObj>obj).hostgroup_name;
    } else if (obj instanceof ServiceGroupObj) {
      return (<ServiceGroupObj>obj).servicegroup_name;
    } else if (obj instanceof TimeperiodObj) {
      return (<TimeperiodObj>obj).timeperiod_name;
    }
  }

}

export abstract class AbstractInheritableNagiosObj extends AbstractNagiosObj implements InheritableNagiosObj {
  name: string = (<InheritableObjectDefinition>this.$decorator).name || this.getObjName(this);
  register: boolean = ((<InheritableObjectDefinition>this.$decorator).register !== undefined) ? (<InheritableObjectDefinition>this.$decorator).register : true;
  use?: string;
}

export class RequiredFieldValidator {

  protected fields: Array<string>;
  protected label?: string;
  protected customMessage?: string;
  protected acceptedValues?: Array<any>;
  private invalidFields: Array<string>;

  constructor(field: string|Array<string>, label?: string, customMessage?: string, acceptedValues?: Array<any>) {
    this.fields = field instanceof Array ? field : [ field ];
    this.label = label;
    this.customMessage = customMessage;
    this.acceptedValues = acceptedValues;
  }

  validate(item: NagiosObj): boolean {
    this.invalidFields = this.fields.filter((field: string) => this.validateField(item, field)).map((field: string) => this.getErrorMessage(field));
    return this.invalidFields.length <= 0;
  }

  toString(): string {
    return this.invalidFields.join(',');
  }

  private getErrorMessage(field: string) {
    if (this.customMessage) {
      return this.customMessage;
    } else if (this.label) {
      return `${this.label} is a required field`;
    } else if (field) {
      return `${field} is a required field`;
    } else {
      return 'Some field has been marked required, but I am not sure which one';
    }
  }

  private validateField(item: NagiosObj, fieldName: string): boolean {
    let field = item[fieldName];

    if (field === null || field === undefined) {
      return false;
    } else if (this.acceptedValues) {
      if (this.acceptedValues instanceof Array) {
        return (this.acceptedValues.indexOf(field) >= 0);
      } else if (typeof this.acceptedValues === 'string' || typeof this.acceptedValues === 'number') {
        return field === this.acceptedValues;
      }
    } else if (typeof field === 'string') {
      return field !== '';
    } else if (typeof field === 'number') {
      return true;
    } else if (field instanceof Date) {
      return true;
    } else if (field instanceof Array) {
      return field.length > 0;
    } else if (typeof field === 'function') {
      return field();
    } else if (typeof field === 'object') {
      let keys = Object.keys(field).map(key => field.hasOwnProperty(key));
      return keys.length > 0;
    }

    return false;
  }

}

// ------------------------------------------------------------------------------------------ Interfaces & types

export interface NagiosObj {
  readonly $decorator?: ObjectDefinition;
  readonly $references?: Array<RefObj>;
  readonly $objectType?: ObjectType;
}

export interface InheritableNagiosObj extends NagiosObj {
  readonly name: string;
}

export interface ExtendableNagiosObj {
  [key: string]: any;
}

export type NagiosClass<T> = { new (...args: any[]): T & NagiosObj } & NagiosObj;
export type InheritableNagiosClass<T> = { new (...args: any[]): T & InheritableNagiosObj } & InheritableNagiosObj;
export enum ObjectType {
  command = 'command',
  contact = 'contact',
  contactgroup = 'contactgroup',
  host = 'host',
  hostgroup = 'hostgroup',
  nagios = 'nagios',
  service = 'service',
  servicegroup = 'servicegroup',
  timeperiod = 'timeperiod'
}