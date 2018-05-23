
import { default as BaseService } from './BaseService';
import { Use, Ref, ServiceObj, Check } from '@remie/nagios-cli';
import Ping from '../checks/Ping';

@Use(BaseService)
export class PingService extends ServiceObj {

  private host: string;

  constructor(description: string, host: string = '$HOSTADDRESS$') {
    super();
    this.host = host;
    this.configuration.service_description = description;
  }

  get check(): Check {
    return new Ping(this.host);
  }

}
