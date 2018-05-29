
import { HostGroup } from '../types';
import { AbstractInheritableNagiosObj, HostObj, ObjectType } from './index';

export abstract class HostGroupObj extends AbstractInheritableNagiosObj {
  objectType = ObjectType.hostgroup;
  configuration: HostGroup;

  get hosts(): Array<HostObj> {
    return [];
  }
}
