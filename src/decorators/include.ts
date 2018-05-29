
import { Timeperiod } from '../types';
import { NagiosClass, NagiosObj, InheritableNagiosObj, RefObj, ObjectType } from '../objects';

export function Include(ref: NagiosObj|InheritableNagiosObj) {
  return function (constructor: NagiosClass<NagiosObj|InheritableNagiosObj>): any {
    constructor.prototype.refs = constructor.prototype.refs || [];
    constructor.prototype.refs.push(new RefObj(ref));
    return constructor;
  };
}
