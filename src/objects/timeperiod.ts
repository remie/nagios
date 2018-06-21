
import { Timeperiod } from '../types';
import { AbstractNagiosObj, ObjectType, RequiredFieldValidator } from './index';

export abstract class TimeperiodObj extends AbstractNagiosObj {

  // ------------------------------------------------------------------------------------------ Properties
  // All properties are marked optional because they can also be set using the decorator
  // The required properties are listed in 'requiredFields'

  timeperiod_name?: string;
  alias?: string;
  exclude?: string|Array<TimeperiodObj>;

  // ------------------------------------------------------------------------------------------ Constructor

  constructor() {
    super(ObjectType.timeperiod);
  }

  // ------------------------------------------------------------------------------------------ Getters & Setters

  toObjectDefinition(): Timeperiod {
    return super.toObjectDefinition() as Timeperiod;
  }

  get requiredFields(): Array<RequiredFieldValidator> {
    return [
      new RequiredFieldValidator('timeperiod_name'),
      new RequiredFieldValidator('alias')
    ];
  }}
