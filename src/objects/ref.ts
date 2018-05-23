
import { AbstractNagiosObj, NagiosObj, InheritableNagiosObj } from './index';

export class RefObj extends AbstractNagiosObj {
  type: ObjectType;
  instance: NagiosObj|InheritableNagiosObj;

  constructor(type: ObjectType, instance: NagiosObj|InheritableNagiosObj) {
    super();
    this.type = type;
    this.instance = instance;
  }
}

export type ObjectType = 'contact'|'contactgroup'|'host'|'hostgroup'|'nagios'|'service'|'servicegroup'|'timeperiod';