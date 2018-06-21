
import { AbstractNagiosObj, NagiosObj, InheritableNagiosObj, ObjectType } from './index';

export class RefObj {
  type: ObjectType;
  instance: NagiosObj|InheritableNagiosObj;

  constructor(instance: NagiosObj|InheritableNagiosObj) {
    this.type = instance._objectType;
    this.instance = instance;
  }
}
