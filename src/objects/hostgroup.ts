
import { HostGroup } from '../types';
import { AbstractInheritableNagiosObj, HostObj } from './index';

export abstract class HostGroupObj extends AbstractInheritableNagiosObj {
  configuration: HostGroup;

  get hosts(): Array<HostObj> {
    return [];
  }
}
