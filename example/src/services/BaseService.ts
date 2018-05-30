
import { Service, ServiceObj } from '@remie/nagios-cli';
import { Ping } from '../checks';

@Service({
  name: 'generic-service',
  service_description: 'Generic Service',
  active_checks_enabled: true,
  passive_checks_enabled: true,
  obsess_over_service: true,
  check_freshness: false,
  notifications_enabled: true,
  event_handler_enabled: true,
  flap_detection_enabled: true,
  process_perf_data: true,
  retain_status_information: true,
  retain_nonstatus_information: true,
  is_volatile: true,
  check_period: '24x7',
  check_interval: 10,
  max_check_attempts: 3,
  notification_options: 'w,u,c,r',
  notification_interval: 60,
  notification_period: '24x7',
  retry_interval: 2,
  register: false
})
export class BaseService extends ServiceObj {}

export default new BaseService();