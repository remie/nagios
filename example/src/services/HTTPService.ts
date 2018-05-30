
import { default as BaseService } from './BaseService';
import { Use, ServiceObj, Check } from '@remie/nagios-cli';
import HTTP from '../checks/HTTP';

@Use(BaseService, {
  notifications_enabled: false
})
export class HTTPService extends ServiceObj {
  private address: string;

  constructor(description: string, address: string) {
    super(description);
    this.address = address;
  }

  get check_command(): Check {
    return new HTTP(this.address);
  }
}
