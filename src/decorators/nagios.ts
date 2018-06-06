
import { Nagios, Cgi, Resource } from '../types';
import { NagiosClass, NagiosObj } from '../objects';

export function Nagios(configuration: Nagios, cgi?: Cgi, resource?: Resource) {

  configuration.cfg_file = configuration.cfg_file || [];

  return function (constructor: NagiosClass<NagiosObj>): any {
    constructor.prototype._decorator = configuration;
    constructor.prototype.cgi = cgi || {};
    constructor.prototype.resource = resource || {};
    return constructor;
  };
}
