
import { Nagios, Cgi, Resource } from '../types';
import { AbstractNagiosObj, HostObj, HostGroupObj, ServiceObj, ServiceGroupObj } from './index';

export abstract class NagiosCfg extends AbstractNagiosObj {
  configuration: Nagios;
  cgi?: Cgi;
  resource?: Resource;

  abstract get hosts(): Array<HostObj>;

}
