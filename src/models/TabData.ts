import { CSVData } from "./CSVData";
import { ChartOptions, ChartType } from "./ChartOptions";

export interface TabData {
  chartType: ChartType;
  chartOptions: ChartOptions;
  inputData: CSVData;
}
