export enum AggregateOption {
  Sum = "Sum",
  Average = "Average",
  Count = "Count",
  Min = "Minimum", 
  Max = "Maximum"
}

export interface GroupByOption {
  groupBy: string;
  aggregates: { column: string; aggregateOption: AggregateOption | "" }[];
}
