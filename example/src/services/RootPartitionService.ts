
import { default as BaseService } from './BaseService';
import { Use, ServiceObj, Check } from '@remie/nagios-cli';
import LocalDisk from '../checks/LocalDisk';

@Use(BaseService)
export class RootPartitionService extends ServiceObj {
  constructor(description: string) {
    super();
    this.configuration.service_description = description;
  }

  get check(): Check {
    return new LocalDisk('/');
  }
}
