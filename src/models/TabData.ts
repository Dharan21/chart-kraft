import { CSVData } from "./CSVData";
import { ChartOptions, ChartType } from "./ChartOptions";
import { Transformation } from "./Transformation";

export interface TabData {
  chartType: ChartType;
  chartOptions: ChartOptions;
  inputData: CSVData;
  transformedData: CSVData;
  transformations: Transformation[];
}
