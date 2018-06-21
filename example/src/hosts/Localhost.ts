
import { Host, HostObj, ServiceObj, ContactObj, ContactGroupObj, Include, Check } from '@remie/nagios-cli';
import { SSH } from '../checks/SSH';
import { Ping } from '../checks/Ping';
import { HTTP } from '../checks/HTTP';
import { SI , SIOptions, SIType } from '../checks/SI';
import { Service } from '../services/Service';
import DefaultContact from '../contacts/DefaultContact';
import DefaultTimeperiod from '../timeperiods/DefaultTimeperiod';

@Host({
  host_name: 'localhost',
  address: '127.0.0.1',
  check_interval: 5,
  retry_interval: 1,
  max_check_attempts: 5,
  check_period: '24x7',
  process_perf_data: false,
  retain_nonstatus_information: false,
  notification_interval: 0,
  notification_period: '24x7',
  notification_options: 'd,u,r'
})
@Include(DefaultTimeperiod)
export class Localhost extends HostObj {
  check_command: Check = new Ping(this.address);
  contacts: Array<ContactObj|ContactGroupObj> = [ DefaultContact ];

  services: Array<ServiceObj> = [
    new Service('Current Load', new SI(SIType.Load)),
    new Service('Current Users', new SI(SIType.Users)),
    new Service('HTTP', new HTTP(`http://${this.address}`)),
    new Service('PING', new Ping(this.address)),
    new Service('Root Partition', new SI(SIType.Disk, { mountpoint: '/' })),
    new Service('SSH', new SSH(this.address)),
    new Service('Swap Usage', new SI(SIType.Swap)),
    new Service('Total Processes', new SI(SIType.Processes))
  ];
}

export default new Localhost();