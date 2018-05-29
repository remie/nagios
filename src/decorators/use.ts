
import { ObjectDefinition } from '../types';
import { InheritableNagiosClass, NagiosObj, InheritableNagiosObj, RefObj, ObjectType } from '../objects';
import { ContactObj, ContactGroupObj, HostObj, HostGroupObj, ServiceObj, ServiceGroupObj, TimeperiodObj } from '../objects';

export function Use(parent: InheritableNagiosObj, configuration: ObjectDefinition = {}) {
  return function (constructor: InheritableNagiosClass<InheritableNagiosObj>): any {
    constructor.prototype.configuration = Object.assign({ use: parent.name }, configuration);
    constructor.prototype.refs = constructor.prototype.refs || [];
    constructor.prototype.refs.push(new RefObj(parent));
    return constructor;
  };
}