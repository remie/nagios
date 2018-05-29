
import { Contact } from '../types';
import { AbstractInheritableNagiosObj, ObjectType } from './index';

export abstract class ContactObj extends AbstractInheritableNagiosObj {
  configuration: Contact;

  constructor() {
    super();
    this.objectType = ObjectType.contact;
  }
}
