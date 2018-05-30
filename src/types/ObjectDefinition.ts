
export interface ObjectDefinition {}

export interface InheritableObjectDefinition extends ObjectDefinition {
  name?: string;
  use?: string;
  register?: boolean;
}
