
import { Check, CheckResult, NagiosResult } from '@remie/nagios-cli';
import { Client } from 'ssh2';

export class SSH implements Check {
  private host: string;
  private port: number;

  constructor(host: string, port: number = 22) {
    this.host = host;
    this.port = port;
  }

  async execute(): Promise<CheckResult> {
    return new Promise<CheckResult>((resolve) => {
      const conn = new Client();
      conn.on('ready', function() {
        resolve({
          message: `connect to address ${this.host} and port ${this.port}: Connection successful`,
          code: NagiosResult.OK
        });
        conn.end();
      }).on('error', function(err) {
        resolve({
          message: `connect to address ${this.host} and port ${this.port}: Connection failed`,
          code: NagiosResult.CRITICAL
        });
        conn.end();
      }).connect({
        host: this.host,
        port: this.port
      });
    });
  }
}