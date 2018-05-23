
import { ObjectDefinition } from '../types';
import { InheritableNagiosClass, NagiosObj, InheritableNagiosObj, RefObj, ObjectType } from '../objects';
import { ContactObj, ContactGroupObj, HostObj, HostGroupObj, ServiceObj, ServiceGroupObj, TimeperiodObj } from '../objects';

export function Use(parent: InheritableNagiosObj, configuration: ObjectDefinition = {}) {
  return function (constructor: InheritableNagiosClass<InheritableNagiosObj>): any {
    constructor.prototype.configuration = Object.assign({ use: parent.name }, configuration);
    constructor.prototype.refs = constructor.prototype.refs || [];
    constructor.prototype.refs.push(new RefObj(getType(parent), parent));
    return constructor;
  };
}

function getType(parent: InheritableNagiosObj): ObjectType {
  if (parent instanceof ContactObj) {
    return 'contact';
  } else if (parent instanceof ContactGroupObj) {
    return 'contactgroup';
  } else if (parent instanceof HostObj) {
    return 'host';
  } else if (parent instanceof HostGroupObj) {
    return 'hostgroup';
  } else if (parent instanceof ServiceObj) {
    return 'service';
  } else if (parent instanceof ServiceGroupObj) {
    return 'servicegroup';
  } else if (parent instanceof TimeperiodObj) {
    return 'timeperiod';
  } else {
    return null;
  }
}