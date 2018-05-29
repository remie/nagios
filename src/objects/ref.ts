
import { AbstractNagiosObj, NagiosObj, InheritableNagiosObj, ObjectType } from './index';

export class RefObj extends AbstractNagiosObj {
  type: ObjectType;
  instance: NagiosObj|InheritableNagiosObj;

  constructor(instance: NagiosObj|InheritableNagiosObj) {
    super();
    this.type = instance.objectType;
    this.instance = instance;
  }
}
