
import BaseService from './BaseService';
import { Use, ServiceObj, Check } from '@remie/nagios-cli';
import { CheckLocalSystem, SiCheckType, SiCheckOptions } from '../checks';

@Use(BaseService)
export class CheckLoadService extends ServiceObj {
  check_command: Check = new CheckLocalSystem(SiCheckType.Load);
}

@Use(BaseService)
export class CheckDiskService extends ServiceObj {
  private mountpoint: string;

  constructor(description: string, mountpoint: string) {
    super(description);
    this.mountpoint = mountpoint;
  }

  get check_command(): Check {
    return new CheckLocalSystem(SiCheckType.Disk, {
      mountpoint: this.mountpoint
    });
  }
}

@Use(BaseService)
export class CheckSwapService extends ServiceObj {
  check_command: Check = new CheckLocalSystem(SiCheckType.Swap);
}

@Use(BaseService)
export class CheckProcessesService extends ServiceObj {
  check_command: Check = new CheckLocalSystem(SiCheckType.Processes);
}

@Use(BaseService)
export class CheckUsersService extends ServiceObj {
  check_command: Check = new CheckLocalSystem(SiCheckType.Users);
}
