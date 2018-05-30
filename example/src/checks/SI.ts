
import { Check, CheckResult, NagiosResult } from '@remie/nagios-cli';
import * as si from 'systeminformation';
import * as filesize from 'filesize';

export class SI implements Check {
  private _type: SIType;
  private _options: SIOptions;

  constructor(type: SIType, options?: SIOptions) {
    this._type = type;
    this._options = options;
  }

  async execute(): Promise<CheckResult> {
    switch (this._type) {
      case SIType.Load:
        return this.checkLoad();
      case SIType.Disk:
        return this.checkDisk();
      case SIType.Swap:
        return this.checkSwap();
      case SIType.Processes:
        return this.checkProcesses();
      case SIType.Users:
        return this.checkUsers();
    }
  }

  private async checkLoad(): Promise<CheckResult> {
    const currentLoad: si.Systeminformation.CurrentLoadData = await si.currentLoad();
    return {
      message: `OK - load average: ${currentLoad.avgload}`,
      code: NagiosResult.OK
    };
  }

  private async checkDisk(): Promise<CheckResult> {
    const options = <SIDiskOptions>this._options;
    const devices: Array<si.Systeminformation.BlockDevicesData> = await si.blockDevices();
    devices.filter((device) => device.mount === options.mountpoint);
    const device: si.Systeminformation.BlockDevicesData = devices.length > 0 ? devices[0] : null;

    const fsSizes: Array<si.Systeminformation.FsSizeData> = await si.fsSize();
    fsSizes.filter((fsSize: si.Systeminformation.FsSizeData) => fsSize.mount === options.mountpoint);
    const fsSize: si.Systeminformation.FsSizeData = fsSizes.length > 0 ? fsSizes[0] : null;
    const fsSizeAvailable = fsSize.size - fsSize.used;

    return {
      message: device ? `DISK OK - free space: ${options.mountpoint} ${filesize(fsSizeAvailable)} (${fsSize.use}%)` : 'DISK NOK - Could not find mountpoint ${options.mountpoint}',
      code: device ? NagiosResult.OK : NagiosResult.CRITICAL
    };
  }

  private async checkSwap(): Promise<CheckResult> {
    const memory = await si.mem();
    return {
      message: `SWAP OK - ${memory.swapfree})% free (${filesize(memory.swapused)} out of ${filesize(memory.swaptotal)})`,
      code: NagiosResult.OK
    };
  }

  private async checkProcesses(): Promise<CheckResult> {
    const processes = await si.processes();
    return {
      message: `PROCS OK: ${processes.all} processes with STATE = RSZDT`,
      code: NagiosResult.OK
    };
  }

  private async checkUsers(): Promise<CheckResult> {
    const users = await si.users();
    return {
      message: `USERS OK - ${users.length} currently logged in`,
      code: NagiosResult.OK
    };
  }

}

export enum SIType {
  Load,
  Disk,
  Swap,
  Processes,
  Users
}

export interface SIOptions {}
export interface SILoadOptions extends SIOptions {}
export interface SIDiskOptions extends SIOptions {
  mountpoint: string;
}
export interface SISwapOptions extends SIOptions {}
export interface SIProcessOptions extends SIOptions {}
export interface SIUsersOptions extends SIOptions {}
