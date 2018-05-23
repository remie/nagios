
import { Host, Check } from '../types';
import { AbstractInheritableNagiosObj, ServiceObj, ContactObj, ContactGroupObj, HostGroupObj } from './index';

export abstract class HostObj extends AbstractInheritableNagiosObj {
  configuration: Host;

  abstract get services(): Array<ServiceObj>;
  abstract get contacts(): Array<ContactObj|ContactGroupObj>;

  get hostgroups(): Array<HostGroupObj> {
    return [];
  }

  get check(): Check {
    return null;
  }


}
