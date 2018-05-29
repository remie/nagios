
import { Check, CheckResult, NagiosResult } from '@remie/nagios-cli';

export default class Notify implements Check {

  private text;

  constructor(text) {
    this.text = text;
  }

  async execute(): Promise<CheckResult> {
    return {
      message: this.text,
      code: NagiosResult.OK
    };
  }
}