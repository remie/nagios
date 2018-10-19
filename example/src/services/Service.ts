
import BaseService from './BaseService';
import { Use, ServiceObj, Check } from '@remie/nagios-cli';

@Use(BaseService)
export class Service extends ServiceObj {
  private $check: Check;

  constructor(description: string, check: Check) {
    super(description);
    this.$check = check;
  }

  get check_command(): Check {
    return this.$check;
  }
}
