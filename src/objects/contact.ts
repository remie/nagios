
import { Contact } from '../types';
import { AbstractInheritableNagiosObj } from './index';

export abstract class ContactObj extends AbstractInheritableNagiosObj {
  configuration: Contact;
}
