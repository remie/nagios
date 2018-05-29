
import { ServiceGroup } from '../types';
import { AbstractInheritableNagiosObj, ServiceObj, ObjectType } from './index';

export abstract class ServiceGroupObj extends AbstractInheritableNagiosObj {
  objectType = ObjectType.servicegroup;
  configuration: ServiceGroup;
  abstract get members(): Array<ServiceObj|ServiceGroupObj>;
}
