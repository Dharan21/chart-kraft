import { CSVData } from "./CSVData";
import { FilterOption } from "./FilterOptions";
import { AggregateOption as AggregateOption } from "./GroupByOptions";

export interface Transformation {
  type: TransformationType;
  data: FilterData | SortData[] | GroupData;
  inputData?: CSVData;
  outputData?: CSVData;
  isApplied: boolean;
}

export enum TransformationType {
  Filter = "filter",
  Sort = "sort",
  Group = "group",
}

export interface FilterTransformation extends Transformation {
  type: TransformationType.Filter;
  data: FilterData;
}

export interface SortTransformation extends Transformation {
  type: TransformationType.Sort;
  data: SortData[];
}

export interface GroupTransformation extends Transformation {
  type: TransformationType.Group;
  data: GroupData;
}

export enum FilterType {
  Relative = "relative",
  Absolute = "absolute",
}

export interface FilterData {
  type: FilterType;
  column: string;
  operator: FilterOption;
  value: string;
}

export enum SortDirection {
  asc = "asc",
  desc = "desc",
}

export interface SortData {
  column: string;
  direction: SortDirection;
}

export interface GroupData {
  columns: string[];
  aggregateData: AggregateData[];
}

export interface AggregateData {
  column: string;
  aggregateOption: AggregateOption;
}