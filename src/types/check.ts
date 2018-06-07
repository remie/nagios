
export interface Check {
  execute(args?: NodeJS.ProcessEnv): Promise<CheckResult>;
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