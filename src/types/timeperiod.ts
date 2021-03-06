
import { ObjectDefinition } from './ObjectDefinition';

// All properties are marked optional because they can also be set as class properties
// The required properties are listed in 'requiredFields' on the implementing object
export interface Timeperiod extends ObjectDefinition {
  timeperiod_name?: string;
  alias?: string;
  exclude?: string;
  [date: string]: string;
}
