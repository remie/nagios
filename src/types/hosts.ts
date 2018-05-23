
import { InheritableObjectDefinition } from './ObjectDefinition';
import { Service, Check, Contact, ContactGroup } from './index';

export interface Host extends InheritableObjectDefinition {
  host_name: string;
  alias?: string;
  display_name?: string;
  address: string;
  parents?: string;
  hostgroups?: string;
  check_command?: string;
  initial_state?: string;
  max_check_attempts: number;
  check_interval?: number;
  retry_interval?: number;
  active_checks_enabled?: boolean;
  passive_checks_enabled?: boolean;
  check_period: string;
  obsess_over_host?: boolean;
  check_freshness?: boolean;
  freshness_threshold?: number;
  event_handler?: string;
  event_handler_enabled?: boolean;
  low_flap_threshold?: number;
  high_flap_threshold?: number;
  flap_detection_enabled?: boolean;
  flap_detection_options?: string;
  process_perf_data?: boolean;
  retain_status_information?:  boolean;
  contacts?: string;
  contact_groups?: string;
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
  vrml_image?: string;
  statusmap_image?: string;
  '2d_coords'?: string;
  '3d_coords'?: string;
}
