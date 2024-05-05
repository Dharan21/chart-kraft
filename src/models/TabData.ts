import { CSVData } from "./CSVData";
import { ChartOptions } from "./ChartOptions";
import { GroupByOption } from "./GroupByOptions";

export type ChartType = "line" | "bar";

export interface TabData {
  chartType: ChartType;
  chartOptions: ChartOptions;
  groupByOption: GroupByOption;
  aggregatedData: CSVData;
}
