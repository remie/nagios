
import { Check } from '@remie/nagios-cli';

export default class Ping implements Check {

  private text;

  constructor(text) {
    this.text = text;
  }

  execute() {
    console.log(this.text);
  }
}