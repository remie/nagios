
import { ServiceGroup } from '../types';
import { NagiosClass, NagiosObj } from '../objects';

export function ServiceGroup(configuration: ServiceGroup) {
  return function (constructor: NagiosClass<NagiosObj>): any {
    constructor.prototype.$decorator = configuration;
    return constructor;
  };
}
