
import { Service, Check } from '../types';
import { AbstractInheritableNagiosObj, ObjectType, RequiredFieldValidator, ContactObj, ContactGroupObj, ServiceGroupObj, HostObj, HostGroupObj, TimeperiodObj } from './index';

export abstract class ServiceObj extends AbstractInheritableNagiosObj {

  _host?: HostObj;

  // ------------------------------------------------------------------------------------------ Properties
  // All properties are marked optional because they can also be set using the decorator
  // The required properties are listed in 'requiredFields'

  host_name?: string|HostObj;
  hostgroup_name?: string|HostGroupObj;
  service_description?: string;
  servicegroups?: string|Array<ServiceGroupObj>;
  display_name?: string;
  is_volatile?: boolean;
  initial_state?: string;
  check_command?: string|Check;
  max_check_attempts?: number;
  check_interval?: number;
  retry_interval?: number;
  active_checks_enabled?: boolean;
  passive_checks_enabled?: boolean;
  check_period?: string|TimeperiodObj;
  obsess_over_service?: boolean;
  check_freshness?: boolean;
  freshness_threshold?: number;
  event_handler?: string|Check;
  event_handler_enabled?: boolean;
  low_flap_threshold?: number;
  high_flap_threshold?: number;
  flap_detection_enabled?: boolean;
  flap_detection_options?: string;
  process_perf_data?: boolean;
  retain_status_information?: boolean;
  retain_nonstatus_information?: boolean;
  notification_interval?: number;
  first_notification_delay?: number;
  notification_period?: string|TimeperiodObj;
  notification_options?: string;
  notifications_enabled?: boolean;
  stalking_options?: string;
  notes?: string;
  notes_url?: string;
  action_url?: string;
  icon_image?: string;
  icon_image_alt?: string;
  contacts?: string|Array<ContactObj>;
  contact_groups?: string|Array<ContactGroupObj>;

  // ------------------------------------------------------------------------------------------ Constructor

  constructor(description?: string) {
    super(ObjectType.service);
    this.service_description = description ? description : this.service_description;
  }

  // ------------------------------------------------------------------------------------------ Getters & Setters

  toObjectDefinition(): Service {
    const definition = super.toObjectDefinition() as Service;

    if (!definition.check_command || typeof definition.check_command !== 'string') {
      definition.check_command = `nagios-cli!services.get('${definition.name}').check_command`;
    }

    if (!definition.event_handler || typeof definition.event_handler !== 'string') {
      definition.event_handler = `nagios-cli!services.get('${definition.name}').event_handler`;
    }

    return definition;
  }

  get requiredFields(): Array<RequiredFieldValidator> {
    return [
      new RequiredFieldValidator('host_name'),
      new RequiredFieldValidator('service_description'),
      new RequiredFieldValidator('check_command'),
      new RequiredFieldValidator('max_check_attempts'),
      new RequiredFieldValidator('check_interval'),
      new RequiredFieldValidator('retry_interval'),
      new RequiredFieldValidator('check_period'),
      new RequiredFieldValidator('notification_interval'),
      new RequiredFieldValidator('notification_period'),
      new RequiredFieldValidator([ 'contacts', 'contact_groups' ], null, 'Either "contacts" or "contact_groups" is required'),
    ];
  }

}
