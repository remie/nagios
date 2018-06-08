
import { InheritableObjectDefinition } from './ObjectDefinition';

export interface HostGroup extends InheritableObjectDefinition {
  hostgroup_name: string;
  alias?: string;
  members?: string;
  hostgroup_members?: string;
  notes?: string;
  notes_url?: string;
  action_url?: string;
}
