
import { ObjectDefinition } from './ObjectDefinition';
import { Timeperiod, ContactGroup, Check } from '../types';

// All properties are marked optional because they can also be set as class properties
// The required properties are listed in 'requiredFields' on the implementing object
export interface Command extends ObjectDefinition {
  command_name?: string;
  command_line?: string;
}
