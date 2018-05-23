
import { ObjectDefinition, InheritableObjectDefinition } from '../types/';

export type NagiosClass<T> = { new (...args: any[]): T & NagiosObj } & NagiosObj;
export type InheritableNagiosClass<T> = { new (...args: any[]): T & InheritableNagiosObj } & InheritableNagiosObj;

export interface NagiosObj {
  configuration?: ObjectDefinition;
  refs?: Array<NagiosObj|InheritableNagiosObj>;
}

export abstract class AbstractNagiosObj implements NagiosObj {
  configuration: ObjectDefinition;
  refs?: Array<NagiosObj>;

  constructor() {
    this.configuration = this.configuration || {};
  }
}

export interface InheritableNagiosObj extends NagiosObj {
  name: string;
  configuration?: InheritableObjectDefinition;
}

export abstract class AbstractInheritableNagiosObj extends AbstractNagiosObj implements InheritableNagiosObj {
  configuration: InheritableObjectDefinition;

  constructor() {
    super();
  }

  get name(): string {
    return this.configuration.name;
  }
}
