
import { Timeperiod, TimeperiodObj } from '@remie/nagios-cli';

@Timeperiod({
  timeperiod_name: '24x7',
  alias: '24 Hours A Day, 7 Days A Week',
  sunday: '00:00-24:00',
  monday: '00:00-24:00',
  tuesday: '00:00-24:00',
  wednesday: '00:00-24:00',
  thursday: '00:00-24:00',
  friday: '00:00-24:00',
  saturday: '00:00-24:00'
})
export class DefaultTimeperiod extends TimeperiodObj {}

export default new DefaultTimeperiod();