
import { InheritableObjectDefinition } from './ObjectDefinition';

export interface ContactGroup extends InheritableObjectDefinition {
  contactgroup_name: string;
  alias: string;
  members?: string;
  contactgroup_members?: string;
}
