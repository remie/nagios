
import { ContactGroup } from '../types';
import { AbstractInheritableNagiosObj, ContactObj, ObjectType } from './index';

export abstract class ContactGroupObj extends AbstractInheritableNagiosObj {
  objectType = ObjectType.contactgroup;
  configuration: ContactGroup;

  abstract members: Array<ContactObj|ContactGroupObj>;
}
