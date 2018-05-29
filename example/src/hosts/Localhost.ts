
import { Host, HostObj, ServiceObj, ContactObj, ContactGroupObj, Include, Check } from '@remie/nagios-cli';
import { PingService, RootPartitionService } from '../services';
import DefaultContact from '../contacts/DefaultContact';
import DefaultTimeperiod from '../timeperiods/DefaultTimeperiod';
import { Ping } from '../checks';

@Host({
  host_name: 'localhost',
  alias: '127.0.0.1',
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
  check: Check = new Ping('localhost');
  contacts: Array<ContactObj|ContactGroupObj> = [ DefaultContact ];

  services: Array<ServiceObj> = [
    new PingService('Ping'),
    new RootPartitionService('Local disk')
  ];
}

export default new Localhost();