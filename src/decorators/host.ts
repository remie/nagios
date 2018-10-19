
import { Host } from '../types';
import { NagiosClass, NagiosObj } from '../objects';

export function Host(configuration: Host) {
  return function (constructor: NagiosClass<NagiosObj>): any {
    constructor.prototype.$decorator = configuration;
    return constructor;
  };
}
