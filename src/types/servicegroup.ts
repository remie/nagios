
import { InheritableObjectDefinition } from './ObjectDefinition';

export interface ServiceGroup extends InheritableObjectDefinition {
  servicegroup_name: string;
  alias: string;
  members: string;
  servicegroup_members: string;
  notes: string;
  notes_url: string;
  action_url: string;
}
