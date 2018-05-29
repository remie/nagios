
import { default as DefaultTimeperiod } from '../timeperiods/DefaultTimeperiod';
import { default as Notify } from '../checks/Notify';
import { Contact, ContactObj, Include, Check, ObjectType, NagiosObj } from '@remie/nagios-cli';

@Contact({
  contact_name: 'rbolte',
  alias: 'Remie Bolte',
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