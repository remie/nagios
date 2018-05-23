
import { Service } from '../types';
import { NagiosClass, NagiosObj } from '../objects';

export function Service(configuration: Service) {
  return function (constructor: NagiosClass<NagiosObj>): any {
    constructor.prototype.configuration = configuration;
    return constructor;
  };
}
