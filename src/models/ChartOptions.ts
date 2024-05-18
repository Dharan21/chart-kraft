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

export const availableChartOptions: ChartType[] = ["bar", "line", "pie"];
export type ChartType = "line" | "bar" | "pie";
