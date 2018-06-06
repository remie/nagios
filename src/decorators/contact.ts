
import { Contact } from '../types';
import { NagiosClass, NagiosObj } from '../objects';

export function Contact(configuration: Contact) {
  return function (constructor: NagiosClass<NagiosObj>): any {
    constructor.prototype._decorator = configuration;
    return constructor;
  };
}
