
import { AbstractNagiosObj, ObjectType, RequiredFieldValidator } from './';
import { Command } from '../types/command';

export abstract class CommandObj extends AbstractNagiosObj {

  // ------------------------------------------------------------------------------------------ Properties
  // All properties are marked optional because they can also be set using the decorator
  // The required properties are listed in 'requiredFields'

  command_name?: string;
  command_line?: string;

  // ------------------------------------------------------------------------------------------ Constructor

  constructor() {
    super(ObjectType.command);
  }

  // ------------------------------------------------------------------------------------------ Getters & Setters

  toObjectDefinition(): Command {
    return super.toObjectDefinition() as Command;
  }

  get requiredFields(): Array<RequiredFieldValidator> {
    return [
      new RequiredFieldValidator('command_name'),
      new RequiredFieldValidator('command_line')
    ];
  }

}