
import { Nagios, Cgi, Resource } from '../types';
import { AbstractNagiosObj, HostObj, HostGroupObj, ServiceObj, ServiceGroupObj, ObjectType } from './index';

export abstract class NagiosCfg extends AbstractNagiosObj {
  objectType = ObjectType.nagios;
  configuration: Nagios;
  cgi?: Cgi;
  resource?: Resource;

  abstract get hosts(): Array<HostObj>;

}
