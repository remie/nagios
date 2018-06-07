
import { Contact, Check } from '../types';
import { AbstractInheritableNagiosObj, ObjectType } from './index';

export abstract class ContactObj extends AbstractInheritableNagiosObj {
  configuration: Contact;
  serviceNotificationCommand?: Check;
  hostNotificationCommand?: Check;

  constructor() {
    super();
    this.objectType = ObjectType.contact;
  }
}
