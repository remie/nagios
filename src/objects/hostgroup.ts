
import { HostGroup } from '../types';
import { AbstractInheritableNagiosObj, ObjectType, RequiredFieldValidator, HostObj, ServiceObj } from './index';

export abstract class HostGroupObj extends AbstractInheritableNagiosObj {

  // ------------------------------------------------------------------------------------------ Properties
  // All properties are marked optional because they can also be set using the decorator
  // The required properties are listed in 'requiredFields'

  hostgroup_name?: string;
  alias?: string;
  members?: string|Array<HostObj>;
  hostgroup_members?: string|Array<HostGroupObj>;
  notes?: string;
  notes_url?: string;
  action_url?: string;

  // ------------------------------------------------------------------------------------------ Constructor

  constructor() {
    super(ObjectType.hostgroup);
  }

  // ------------------------------------------------------------------------------------------ Getters & Setters

  services: Array<ServiceObj>|Promise<Array<ServiceObj>> = [];

  toObjectDefinition(): HostGroup {
    const definition = super.toObjectDefinition() as HostGroup;
    delete definition['services'];
    return definition;
  }

  get requiredFields(): Array<RequiredFieldValidator> {
    return [
      new RequiredFieldValidator('hostgroup_name'),
      new RequiredFieldValidator('alias')
    ];
  }
}
