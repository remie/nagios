
import { Host, HostObj, ServiceObj, ContactObj, ContactGroupObj, Ref, Check } from '@remie/nagios-cli';
import { PingService } from '../services/PingService';
import DefaultContact from '../contacts/DefaultContact';
import DefaultTimeperiod from '../timeperiods/DefaultTimeperiod';
import Ping from '../checks/Ping';

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
@Ref('timeperiod', DefaultTimeperiod)
export class Localhost extends HostObj {

  get check(): Check {
    return new Ping('There is no place like 127.0.0.1');
  }

  get contacts(): Array<ContactObj|ContactGroupObj> {
    return [
      DefaultContact
    ];
  }

  get services(): Array<ServiceObj> {
    return [
      new PingService('Ping')
    ];
  }

}

export default new Localhost();