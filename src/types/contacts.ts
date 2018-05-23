
import { InheritableObjectDefinition } from './ObjectDefinition';
import { Timeperiod, ContactGroup, Check } from '../types';

export interface Contact extends InheritableObjectDefinition {
  contact_name: string;
  alias?: string;
  contactgroups?: string;
  host_notifications_enabled?: boolean;
  service_notifications_enabled?: boolean;
  host_notification_period?: string;
  service_notification_period?: string;
  host_notification_options?: string;
  service_notification_options?: string;
  host_notification_commands?: string;
  service_notification_commands?: string;
  email?: string;
  pager?: string|number;
  addressx?: string;
  can_submit_commands?: boolean;
  retain_status_information?: boolean;
  retain_nonstatus_information?: boolean;
}
