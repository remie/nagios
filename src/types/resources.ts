
import { ObjectDefinition } from './ObjectDefinition';

export interface Resource extends ObjectDefinition {
  [id: string]: string;
}
