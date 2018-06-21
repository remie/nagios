
import { ContactGroup } from '../types';
import { AbstractInheritableNagiosObj, ObjectType, RequiredFieldValidator, ContactObj } from './index';

export abstract class ContactGroupObj extends AbstractInheritableNagiosObj {

  // ------------------------------------------------------------------------------------------ Properties
  // All properties are marked optional because they can also be set using the decorator
  // The required properties are listed in 'requiredFields'

  contactgroup_name?: string;
  alias?: string;
  members?: string|Array<ContactObj>;
  contactgroup_members?: string|Array<ContactGroupObj>;

  // ------------------------------------------------------------------------------------------ Constructor

  constructor() {
    super(ObjectType.contactgroup);
  }

  // ------------------------------------------------------------------------------------------ Getters & Setters

  toObjectDefinition(): ContactGroup {
    return super.toObjectDefinition() as ContactGroup;
  }

  get requiredFields(): Array<RequiredFieldValidator> {
    return [
      new RequiredFieldValidator('contactgroup_name'),
      new RequiredFieldValidator('alias')
    ];
  }

}
