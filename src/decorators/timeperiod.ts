
import { Timeperiod } from '../types';
import { NagiosClass, NagiosObj } from '../objects';

export function Timeperiod(configuration: Timeperiod) {
  return function (constructor: NagiosClass<NagiosObj>): any {
    constructor.prototype.configuration = configuration;
    return constructor;
  };
}
