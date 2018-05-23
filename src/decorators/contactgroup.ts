
import { ContactGroup } from '../types';
import { NagiosClass, NagiosObj } from '../objects';

export function ContactGroup(configuration: ContactGroup) {
  return function (constructor: NagiosClass<NagiosObj>): any {
    constructor.prototype.configuration = configuration;
    return constructor;
  };
}
