
import { Check } from '@remie/nagios-cli';

export default class Notify implements Check {

  private text;

  constructor(text) {
    this.text = text;
  }

  execute() {
    console.log(this.text);
  }
}