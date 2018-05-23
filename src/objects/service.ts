
import { Service } from '../types';
import { AbstractInheritableNagiosObj, ContactObj, ContactGroupObj, ServiceGroupObj } from './index';

export abstract class ServiceObj extends AbstractInheritableNagiosObj {
  configuration: Service;

  contacts(): Array<ContactObj|ContactGroupObj> {
    return null;
  }
}
