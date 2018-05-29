
export interface Check {
  execute(): Promise<CheckResult>;
}

export interface CheckResult {
  message?: string;
  code: NagiosResult;
}

export enum NagiosResult {
  OK = 0,
  WARNING = 1,
  CRITICAL = 2,
  UNKNOWN = 3
}