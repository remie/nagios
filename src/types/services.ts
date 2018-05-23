
import { InheritableObjectDefinition } from './ObjectDefinition';
import { TimeperiodObj } from '../objects/timeperiod';
import { Check } from './check';

/*
  Set by compiler:
  - host_name
  - hostgroup_name

  Set by ServiceObj:
  - servicegroups
  - check_command
  - contacts
  - contact_groups
*/
export interface Service extends InheritableObjectDefinition {
  host_name?: string; // Required option, but is normally set by the compiler
  hostgroup_name?: string; // Required option, but is normally set by the compiler
  service_description: string;
  servicegroups?: string;
  display_name?: string;
  is_volatile?: boolean;
  initial_state?: string;
  check_command?: string; // Required option, but can be overridden in the service object
  max_check_attempts: number;
  check_interval: number;
  retry_interval: number;
  active_checks_enabled?: boolean;
  passive_checks_enabled?: boolean;
  check_period: string;
  obsess_over_service?: boolean;
  check_freshness?: boolean;
  freshness_threshold?: number;
  event_handler?: string;
  event_handler_enabled?: boolean;
  low_flap_threshold?: number;
  high_flap_threshold?: number;
  flap_detection_enabled?: boolean;
  flap_detection_options?: string;
  process_perf_data?: boolean;
  retain_status_information?: boolean;
  retain_nonstatus_information?: boolean;
  notification_interval: number;
  first_notification_delay?: number;
  notification_period: string;
  notification_options?: string;
  notifications_enabled?: boolean;
  stalking_options?: string;
  notes?: string;
  notes_url?: string;
  action_url?: string;
  icon_image?: string;
  icon_image_alt?: string;
  contacts?: string; // Required option, but can be overridden in the service object
  contact_groups?: string; // Required option, but can be overridden in the service object
}
