
import { ServiceGroup } from '../types';
import { AbstractInheritableNagiosObj, ServiceObj } from './index';

export abstract class ServiceGroupObj extends AbstractInheritableNagiosObj {
  configuration: ServiceGroup;
  abstract get members(): Array<ServiceObj|ServiceGroupObj>;
}
