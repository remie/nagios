
import { Check, CheckResult, NagiosResult } from '@remie/nagios-cli';
import * as ping from 'ping';

export class Ping implements Check {
  private host: string;

  constructor(host: string) {
    this.host = host;
  }

  async execute(): Promise<CheckResult> {
    const result = await ping.promise.probe(this.host);
    return {
      message: result.output,
      code: result.alive ? NagiosResult.OK : NagiosResult.CRITICAL
    };
  }
}