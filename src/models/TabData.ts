import { CSVData } from "./CSVData";
import { ChartOptions, ChartType } from "./ChartOptions";
import { GroupByOption } from "./GroupByOptions";

export interface TabData {
  chartType: ChartType;
  chartOptions: ChartOptions;
  groupByOption: GroupByOption;
  aggregatedData: CSVData;
}
