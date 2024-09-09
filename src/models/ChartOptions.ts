export type ChartOptions = BarChartOptions | LineChartOptions | PieChartOptions;

export interface BarChartOptions {
  plotX: string;
  plotY: string[];
}

export interface LineChartOptions {
  plotX: string;
  plotY: string[];
}

export interface PieChartOptions {
  valueColumn: string;
  labelColumn: string;
}

export enum ChartType {
  Line = "Line",
  Bar = "Bar",
  Pie = "Pie",
}
export const availableChartOptions: ChartType[] = Object.values(ChartType);
