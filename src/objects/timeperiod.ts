
import { Timeperiod } from '../types';
import { AbstractNagiosObj, ObjectType } from './index';

export abstract class TimeperiodObj extends AbstractNagiosObj {
  objectType = ObjectType.timeperiod;
  configuration: Timeperiod;
}
