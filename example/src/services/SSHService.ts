
import { default as BaseService } from './BaseService';
import { Use, ServiceObj, Check } from '@remie/nagios-cli';
import SSH from '../checks/SSH';

@Use(BaseService, {
  notifications_enabled: false
})
export class SSHService extends ServiceObj {
  private host: string;
  private port: number;

  constructor(description: string, host: string, port: number = 22) {
    super(description);
    this.host = host;
    this.port = port;
  }

  get check_command(): Check {
    return new SSH(this.host, this.port);
  }
}
