
import { HostGroup } from '../types';
import { NagiosClass, NagiosObj } from '../objects';

export function HostGroup(configuration: HostGroup) {
  return function (constructor: NagiosClass<NagiosObj>): any {
    constructor.prototype._decorator = configuration;
    return constructor;
  };
}
