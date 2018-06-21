
import BaseService from './BaseService';
import { Use, ServiceObj, Check } from '@remie/nagios-cli';

@Use(BaseService)
export class Service extends ServiceObj {
  private _check: Check;

  constructor(description: string, check: Check) {
    super(description);
    this._check = check;
  }

  get check_command(): Check {
    return this._check;
  }
}
