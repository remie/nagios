
import { NagiosClass, NagiosObj, InheritableNagiosObj, RefObj } from '../objects';

export function Include(ref: NagiosObj|InheritableNagiosObj) {
  return function (constructor: NagiosClass<NagiosObj|InheritableNagiosObj>): any {
    constructor.prototype.$references = constructor.prototype.$references || [];
    constructor.prototype.$references.push(new RefObj(ref));
    return constructor;
  };
}
