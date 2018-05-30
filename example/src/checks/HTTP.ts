
import { Check, CheckResult, NagiosResult } from '@remie/nagios-cli';
import axios from 'axios';

export class HTTP implements Check {
  private host: string;

  constructor(host: string) {
    this.host = host;
  }

  async execute(): Promise<CheckResult> {
    try {
      const result = await axios.get(this.host);
      const success = result.status > 200 && result.status < 400;

      return {
        message: success ? `HTTP OK: ${result.status} Found` : `HTTP NOK: ${result.status} Found`,
        code: success ? NagiosResult.OK : NagiosResult.CRITICAL
      };
    } catch (error) {
      return {
        message: `HTTP NOK: ${error.toString()}`,
        code: NagiosResult.CRITICAL
      };
    }
  }
}