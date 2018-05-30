
import BaseService from './BaseService';
import { Use, ServiceObj, Check } from '@remie/nagios-cli';
import { Ping } from '../checks';

@Use(BaseService)
export class PingService extends ServiceObj {
  private address: string;

  constructor(description: string, address: string) {
    super(description);
    this.address = address;
  }

  get check_command(): Check {
    return new Ping(this.address);
  }
}
