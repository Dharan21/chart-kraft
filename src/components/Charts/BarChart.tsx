import { updateChartOptions } from "@/lib/features/appSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { SupportedDataType } from "@/models/CSVData";
import { BarChartOptions } from "@/models/ChartOptions";
import { isDate } from "date-fns";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenuCheckboxes,
  DropdownMenuCheckboxOption,
} from "../common/dropdown-menu-checkboxes";
import ChartFragement from "./ChartFragement";
import { BarChart } from "@mui/x-charts";

type BarChartProps = {
  chartOptions: BarChartOptions;
};

export default function BarChartComponent({ chartOptions }: BarChartProps) {
  const csvData = useAppSelector(
    (state) => state.app.tabsData[state.app.currentTabIndex].transformedData
  );
  const [headerNames, setHeaderNames] = useState<string[]>(
    csvData.headers.map((x) => x.name)
  );
  const [numberTypeHeaders, setNumberTypeHeaders] = useState(
    csvData.headers.filter((x) => x.type === SupportedDataType.Number)
  );

  const [plotYOptions, setPlotYOptions] = useState(numberTypeHeaders);
  const [plotXOptions, setPlotXOptions] = useState<string[]>(headerNames);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!csvData) return;
    const headerNames = csvData.headers.map((x) => x.name);
    const numberTypeHeaders = csvData.headers.filter(
      (x) => x.type === SupportedDataType.Number
    );
    setHeaderNames(headerNames);
    setNumberTypeHeaders(numberTypeHeaders);
    setPlotYOptions(
      numberTypeHeaders.filter((x) => x.name !== chartOptions.plotX)
    );
    setPlotXOptions(
      headerNames.filter((header) => !chartOptions.plotY?.includes(header))
    );
  }, [csvData]);

  const handleChartOptionsChange = (chartOptions: BarChartOptions) => {
    dispatch(updateChartOptions(chartOptions));
  };

  const handleMultipleSelectionChange = (
    options: DropdownMenuCheckboxOption[]
  ) => {
    const selectedValues: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].checked) {
        selectedValues.push(options[i].label);
      }
    }
    handleChartOptionsChange({
      plotX: chartOptions.plotX,
      plotY: selectedValues,
    });
    setPlotXOptions(headerNames.filter((x) => !selectedValues.includes(x)));
  };

  const handleSelectionChange = (value: string) => {
    handleChartOptionsChange({
      plotX: value,
      plotY: chartOptions.plotY,
    });
    setPlotYOptions(numberTypeHeaders.filter((x) => x.name !== value));
  };

  const valueFormatter = (value: any) => {
    if (isDate(value)) {
      return value.toDateString();
    }
    return value.toString();
  };

  return (
    <>
      <div className="flex gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="plot-x">Chart Type</Label>
          <Select
            name="plot-x"
            value={chartOptions.plotX ?? ""}
            onValueChange={handleSelectionChange}
          >
            <SelectTrigger id="plot-x">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              {plotXOptions.map((header, i) => (
                <SelectItem key={`plot-x-${i}`} value={header}>
                  {header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="plot-y">Plot on y</Label>
          <DropdownMenuCheckboxes
            label="Plot on y"
            options={plotYOptions.map((opt) => ({
              label: opt.name,
              checked: chartOptions.plotY?.includes(opt.name) ?? false,
            }))}
            onCheckedChange={handleMultipleSelectionChange}
          />
        </div>
      </div>
      {chartOptions.plotX &&
        chartOptions.plotY &&
        chartOptions.plotY.length > 0 && (
          <ChartFragement>
            <BarChart
              height={400}
              dataset={csvData.rows}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: chartOptions.plotX,
                  valueFormatter,
                },
              ]}
              series={chartOptions.plotY.map((x) => ({ dataKey: x, label: x }))}
            />
          </ChartFragement>
        )}
    </>
  );
}
