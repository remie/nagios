
import BaseService from './BaseService';
import { Use, ServiceObj, Check } from '@remie/nagios-cli';
import { SI, SIOptions, SIType } from '../checks';

@Use(BaseService)
export class SILoadService extends ServiceObj {
  check_command: Check = new SI(SIType.Load);
}

@Use(BaseService)
export class SIDiskService extends ServiceObj {
  private mountpoint: string;

  constructor(description: string, mountpoint: string) {
    super(description);
    this.mountpoint = mountpoint;
  }

  get check_command(): Check {
    return new SI(SIType.Disk, {
      mountpoint: this.mountpoint
    });
  }
}

@Use(BaseService)
export class SISwapService extends ServiceObj {
  check_command: Check = new SI(SIType.Swap);
}

@Use(BaseService)
export class SIProcessesService extends ServiceObj {
  check_command: Check = new SI(SIType.Processes);
}

@Use(BaseService)
export class SIUsersService extends ServiceObj {
  check_command: Check = new SI(SIType.Users);
}
