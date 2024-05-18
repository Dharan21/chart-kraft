import { SupportedDataType } from "./CSVData";

export type FilterRow = {
  header: string;
  dataType: SupportedDataType | "";
  type: FilterOptions | "";
  value: string;
};

type StringFilterOptions =
  | "equal"
  | "notEqual"
  | "contains"
  | "notContains"
  | "startsWith"
  | "endsWith";

type NumberFilterOptions = "greater" | "lesser" | "equal" | "notEqual";

export const stringFilterOptions: StringFilterOptions[] = [
  "equal",
  "notEqual",
  "contains",
  "notContains",
  "startsWith",
  "endsWith",
];

export const numberFilterOptions: NumberFilterOptions[] = [
  "greater",
  "lesser",
  "equal",
  "notEqual",
];

export type FilterOptions = StringFilterOptions | NumberFilterOptions;
