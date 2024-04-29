export const GroupByOptions = ["sum", "avg", "count", "min", "max"] as const;

export type AggregateOptions = "sum" | "avg" | "count" | "min" | "max";

export interface GroupByOption {
  groupBy: string;
  aggregates: { column: string; aggregateOption: AggregateOptions | "" }[];
}
