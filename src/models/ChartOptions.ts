export type ChartOptions = BarChartOptions | LineChartOptions;

export interface BarChartOptions {
  plotX: string;
  plotY: string[];
}

export interface LineChartOptions {}
