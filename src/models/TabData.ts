import { ChartOptions } from "./ChartOptions";

export type ChartType = "line" | "bar";

export interface TabData {
  chartType: ChartType;
  chartOptions: ChartOptions;
}
