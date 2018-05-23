
import { ObjectDefinition } from './ObjectDefinition';

export interface Timeperiod extends ObjectDefinition {
  timeperiod_name: string;
  alias: string;
  [date: string]: string;
}
