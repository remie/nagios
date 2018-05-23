
import { Timeperiod } from '../types';
import { NagiosClass, NagiosObj, InheritableNagiosObj, RefObj, ObjectType } from '../objects';

export function Ref(type: ObjectType, ref: NagiosObj|InheritableNagiosObj|string) {
  if (typeof ref === 'string') {
    ref = require(ref) as NagiosObj|InheritableNagiosObj;
  }

  return function (constructor: NagiosClass<NagiosObj|InheritableNagiosObj>): any {
    constructor.prototype.refs = constructor.prototype.refs || [];
    constructor.prototype.refs.push(new RefObj(type, ref as NagiosObj|InheritableNagiosObj));
    return constructor;
  };
}
