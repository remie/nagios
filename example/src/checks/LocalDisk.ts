
import { Check, CheckResult, NagiosResult } from '@remie/nagios-cli';
import * as si from 'systeminformation';

export default class LocalDisk implements Check {
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  async execute(): Promise<CheckResult> {
    const devices = await si.blockDevices();

    console.log(devices);

    devices.filter((device) => device.mount === this.path);
    const device = devices.length > 0 ? devices[0] : null;

    return {
      message: device ? `${device.mount} (name: ${device.name}; type: ${device.type}; filesystem: ${device.fstype}; size: ${device.size})` : `No device found on mountpoint ${this.path}`,
      code: device ? NagiosResult.OK : NagiosResult.CRITICAL
    };
  }
}