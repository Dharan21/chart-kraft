import { updateChartOptions } from "@/lib/features/appSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { SupportedDataType } from "@/models/CSVData";
import { PieChartOptions } from "@/models/ChartOptions";
import { PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import ChartFragement from "./ChartFragement";

type PieChartProps = {
  chartOptions: PieChartOptions;
};

export default function PieChartCompnent({ chartOptions }: PieChartProps) {
  const csvData = useAppSelector(
    (state) => state.app.tabsData[state.app.currentTabIndex].transformedData
  );

  const [headerNames, setHeaderNames] = useState<string[]>(
    csvData.headers.map((x) => x.name)
  );
  const [numberTypeHeaders, setNumberTypeHeaders] = useState(
    csvData.headers.filter((x) => x.type === SupportedDataType.Number)
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!csvData) return;
    setHeaderNames(csvData.headers.map((x) => x.name));
    setNumberTypeHeaders(
      csvData.headers.filter((x) => x.type === SupportedDataType.Number)
    );
  }, [csvData]);

  const handleChartOptionsChange = (chartOptions: PieChartOptions) => {
    dispatch(updateChartOptions(chartOptions));
  };

  const handleSelectionChange = (value: string, change: "value" | "label") => {
    const updatedChartOptions = {
      valueColumn: change === "value" ? value : chartOptions.valueColumn,
      labelColumn: change === "label" ? value : chartOptions.labelColumn,
    };
    handleChartOptionsChange(updatedChartOptions);
  };

  return (
    <>
      <div className="flex gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="label-to-show">Select Label To Show</Label>
          <Select
            name="plot-x"
            value={chartOptions.labelColumn ?? ""}
            onValueChange={(value) => handleSelectionChange(value, "label")}
          >
            <SelectTrigger id="label-to-show">
              <SelectValue placeholder="Select Label To Show" />
            </SelectTrigger>
            <SelectContent>
              {headerNames.map((header, i) => (
                <SelectItem key={`plot-x-${i}`} value={header}>
                  {header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="column">Select Column</Label>
          <Select
            name="column"
            value={chartOptions.valueColumn ?? ""}
            onValueChange={(value) => handleSelectionChange(value, "value")}
          >
            <SelectTrigger id="column">
              <SelectValue placeholder="Select Column" />
            </SelectTrigger>
            <SelectContent>
              {numberTypeHeaders.map((header, i) => (
                <SelectItem key={`plot-x-${i}`} value={header.name}>
                  {header.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {chartOptions.valueColumn && (
        <ChartFragement>
          <PieChart
            height={400}
            series={[
              {
                data: csvData.rows
                  .filter(
                    (x) =>
                      !!x[chartOptions.valueColumn] &&
                      !!x[chartOptions.labelColumn] &&
                      !isNaN(x[chartOptions.valueColumn] as number)
                  )
                  .map((row, index) => ({
                    id: index,
                    label: row[chartOptions.labelColumn]?.toString() ?? "",
                    value: row[chartOptions.valueColumn] as number,
                  })),
              },
            ]}
          />
        </ChartFragement>
      )}
    </>
  );
}
