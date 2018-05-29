
import { Service } from '../types';
import { AbstractInheritableNagiosObj, ContactObj, ContactGroupObj, ServiceGroupObj, ObjectType } from './index';

export abstract class ServiceObj extends AbstractInheritableNagiosObj {
  objectType = ObjectType.service;
  configuration: Service;

  contacts(): Array<ContactObj|ContactGroupObj> {
    return null;
  }
}
