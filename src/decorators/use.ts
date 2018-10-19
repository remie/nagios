
import { ObjectDefinition } from '../types';
import { InheritableNagiosClass, NagiosObj, InheritableNagiosObj, RefObj, ObjectType } from '../objects';
import { ContactObj, ContactGroupObj, HostObj, HostGroupObj, ServiceObj, ServiceGroupObj, TimeperiodObj } from '../objects';
import * as cloneDeep from 'lodash.clonedeep';

export function Use(parent: InheritableNagiosObj, configuration: ObjectDefinition = {}) {
  return function (constructor: InheritableNagiosClass<InheritableNagiosObj>): any {
    constructor.prototype.$decorator = Object.assign(cloneDeep(configuration), { use: parent.name });
    constructor.prototype.$references = constructor.prototype.$references || [];
    constructor.prototype.$references.push(new RefObj(parent));
    return constructor;
  };
}