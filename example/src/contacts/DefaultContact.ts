
import { Notify } from '../checks/';
import { Contact, ContactObj, Include, Check, ObjectType, NagiosObj } from '@remie/nagios-cli';
import DefaultTimeperiod from '../timeperiods/DefaultTimeperiod';

@Contact({
  contact_name: 'nagiosadmin',
  alias: 'Nagios Administrator',
  service_notification_period: '24x7',
  host_notification_period: '24x7'
})
@Include(DefaultTimeperiod)
export class DefaultContact extends ContactObj {

  serviceNotificationCommand(): Check {
    return new Notify('You\'ve been served');
  }

  hostNotificationCommand(): Check {
    return new Notify('You\'ve been served');
  }

}

export default new DefaultContact();