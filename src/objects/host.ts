
import { Host, Check } from '../types';
import { NagiosObj, AbstractInheritableNagiosObj, ServiceObj, ContactObj, ContactGroupObj, HostGroupObj, TimeperiodObj, ObjectType, RequiredFieldValidator } from './index';

export abstract class HostObj extends AbstractInheritableNagiosObj {

  // ------------------------------------------------------------------------------------------ Properties
  // All properties are marked optional because they can also be set using the decorator
  // The required properties are listed in 'requiredFields'

  host_name?: string;
  alias?: string;
  display_name?: string;
  address?: string;
  parents?: string|Array<HostObj>;
  hostgroups?: string|Array<HostGroupObj>;
  check_command?: string|Check;
  initial_state?: string;
  max_check_attempts?: number;
  check_interval?: number;
  retry_interval?: number;
  active_checks_enabled?: boolean;
  passive_checks_enabled?: boolean;
  check_period?: string|TimeperiodObj;
  obsess_over_host?: boolean;
  check_freshness?: boolean;
  freshness_threshold?: number;
  event_handler?: string|Check;
  event_handler_enabled?: boolean;
  low_flap_threshold?: number;
  high_flap_threshold?: number;
  flap_detection_enabled?: boolean;
  flap_detection_options?: string;
  process_perf_data?: boolean;
  retain_status_information?:  boolean;
  contacts?: string|Array<ContactObj>;
  contact_groups?: string|Array<ContactGroupObj>;
  retain_nonstatus_information?: boolean;
  notification_interval: number;
  first_notification_delay?: number;
  notification_period: string|TimeperiodObj;
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

  // ------------------------------------------------------------------------------------------ Constructor

  constructor() {
    super(ObjectType.host);
  }

  // ------------------------------------------------------------------------------------------ Getters & Setters

  services?: Array<ServiceObj>;

  toObjectDefinition(): Host {
    const definition = super.toObjectDefinition() as Host;
    delete definition['services'];

    if (definition.check_command && typeof definition.check_command !== 'string') {
      definition.check_command = `nagios-cli!hosts.get('${definition.host_name}').check_command`;
    }

    if (definition.event_handler && typeof definition.event_handler !== 'string') {
      definition.event_handler = `nagios-cli!hosts.get('${definition.host_name}').event_handler`;
    }

    return definition;
  }

  get requiredFields(): Array<RequiredFieldValidator> {
    return [
      new RequiredFieldValidator('host_name'),
      new RequiredFieldValidator('max_check_attempts'),
      new RequiredFieldValidator('check_period'),
      new RequiredFieldValidator([ 'contacts', 'contact_groups' ], null, 'Either "contacts" or "contact_groups" is required'),
      new RequiredFieldValidator('notification_interval'),
      new RequiredFieldValidator('notification_period')
    ];
  }
}