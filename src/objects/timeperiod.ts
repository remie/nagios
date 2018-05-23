
import { Timeperiod } from '../types';
import { AbstractNagiosObj } from './index';

export abstract class TimeperiodObj extends AbstractNagiosObj {
  configuration: Timeperiod;
}
