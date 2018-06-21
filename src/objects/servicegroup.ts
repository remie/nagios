
import { ServiceGroup } from '../types';
import { AbstractInheritableNagiosObj, ObjectType, RequiredFieldValidator, ServiceObj } from './index';

export abstract class ServiceGroupObj extends AbstractInheritableNagiosObj {

  // ------------------------------------------------------------------------------------------ Properties
  // All properties are marked optional because they can also be set using the decorator
  // The required properties are listed in 'requiredFields'

  servicegroup_name?: string;
  alias?: string;
  members?: string|Array<ServiceObj>;
  servicegroup_members?: string|Array<ServiceGroupObj>;
  notes?: string;
  notes_url?: string;
  action_url?: string;

  // ------------------------------------------------------------------------------------------ Constructor

  constructor() {
    super(ObjectType.servicegroup);
  }

  // ------------------------------------------------------------------------------------------ Getters & Setters

  toObjectDefinition(): ServiceGroup {
    return super.toObjectDefinition() as ServiceGroup;
  }

  get requiredFields(): Array<RequiredFieldValidator> {
    return [
      new RequiredFieldValidator('servicegroup_name'),
      new RequiredFieldValidator('alias')
    ];
  }

}
