export enum StringFilterOption {
  Equal = "equal",
  NotEqual = "notEqual",
  Contains = "contains",
  NotContains = "not contains",
  StartsWith = "starts with",
  EndsWith = "ends with",
}

export enum NumberFilterOption {
  GreaterThan = "greater than",
  GreaterThanOrEqual = "greater than or equals",
  LesserThan = "lesser than",
  LesserThanOrEqual = "lesser than or equals",
  Equal = "equal",
  NotEqual = "not equal",
}

export enum DateFilterOption {
  Before = "before",
  After = "after",
  On = "on",
  NotOn = "not on",
}

export type FilterOption = StringFilterOption | NumberFilterOption | DateFilterOption;
