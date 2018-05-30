
import { Host, Check } from '../types';
import { AbstractInheritableNagiosObj, ServiceObj, ContactObj, ContactGroupObj, HostGroupObj, ObjectType } from './index';

export abstract class HostObj extends AbstractInheritableNagiosObj {
  objectType = ObjectType.host;
  configuration: Host;

  abstract get services(): Array<ServiceObj>;
  abstract get contacts(): Array<ContactObj|ContactGroupObj>;
}