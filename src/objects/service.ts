
import { Service } from '../types';
import { AbstractInheritableNagiosObj, ContactObj, ContactGroupObj, ServiceGroupObj, ObjectType } from './index';

export abstract class ServiceObj extends AbstractInheritableNagiosObj {
  objectType = ObjectType.service;
  configuration: Service;

  constructor(description?: string) {
    super();
    if (description) {
      this.configuration.service_description = description;
    }
  }

  contacts(): Array<ContactObj|ContactGroupObj> {
    return null;
  }
}
