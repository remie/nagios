
import { ContactGroup } from '../types';
import { NagiosClass, NagiosObj } from '../objects';

export function ContactGroup(configuration: ContactGroup) {
  return function (constructor: NagiosClass<NagiosObj>): any {
    constructor.prototype._decorator = configuration;
    return constructor;
  };
}
