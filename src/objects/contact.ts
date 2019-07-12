
import { Contact, Check } from '../types';
import { AbstractInheritableNagiosObj, ContactGroupObj, TimeperiodObj, ObjectType, RequiredFieldValidator } from './index';

export abstract class ContactObj extends AbstractInheritableNagiosObj {

  // ------------------------------------------------------------------------------------------ Properties
  // All properties are marked optional because they can also be set using the decorator
  // The required properties are listed in 'requiredFields'

  contact_name?: string;
  alias?: string;
  contactgroups?: string|Array<ContactGroupObj>;
  host_notifications_enabled?: boolean;
  service_notifications_enabled?: boolean;
  host_notification_period?: string|TimeperiodObj;
  service_notification_period?: string|TimeperiodObj;
  host_notification_options?: string;
  service_notification_options?: string;
  host_notification_commands?: string|Check;
  service_notification_commands?: string|Check;
  email?: string;
  pager?: string|number;
  addressx?: string;
  can_submit_commands?: boolean;
  retain_status_information?: boolean;
  retain_nonstatus_information?: boolean;

  // ------------------------------------------------------------------------------------------ Constructor

  constructor() {
    super(ObjectType.contact);
  }

  // ------------------------------------------------------------------------------------------ Getters & Setters

  toObjectDefinition(): Contact {
    const definition = super.toObjectDefinition() as Contact;
    if (definition.host_notification_commands && typeof definition.host_notification_commands !== 'string') {
      definition.host_notification_commands = `nagios-cli!contacts.get('${definition.contact_name}').host_notification_commands`;
    }
    if (definition.service_notification_commands && typeof definition.service_notification_commands !== 'string') {
      definition.service_notification_commands = `nagios-cli!contacts.get('${definition.contact_name}').service_notification_commands`;
    }
    return definition;
  }

  get requiredFields(): Array<RequiredFieldValidator> {
    return [
      new RequiredFieldValidator('contact_name'),
      new RequiredFieldValidator('host_notifications_enabled'),
      new RequiredFieldValidator('service_notifications_enabled'),
      new RequiredFieldValidator('host_notification_period'),
      new RequiredFieldValidator('service_notification_period'),
      new RequiredFieldValidator('host_notification_options'),
      new RequiredFieldValidator('service_notification_options'),
      new RequiredFieldValidator('host_notification_commands'),
      new RequiredFieldValidator('service_notifications_commands'),
    ];
  }

}
