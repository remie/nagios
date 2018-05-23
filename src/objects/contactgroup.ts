
import { ContactGroup } from '../types';
import { AbstractInheritableNagiosObj, ContactObj } from './index';

export abstract class ContactGroupObj extends AbstractInheritableNagiosObj {
  configuration: ContactGroup;

  abstract members: Array<ContactObj|ContactGroupObj>;
}
