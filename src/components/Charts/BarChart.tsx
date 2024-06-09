import { updateChartOptions } from "@/lib/features/tabs/tabsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { BarChartOptions } from "@/models/ChartOptions";
import { BarChart } from "@mui/x-charts";
import { useEffect, useState } from "react";

type BarChartProps = {
  chartOptions: BarChartOptions;
};

export default function BarChartComponent({ chartOptions }: BarChartProps) {
  const csvData = useAppSelector(
    (state) => state.tabs.data[state.tabs.currentTabIndex].inputData
  );
  const [headerNames, setHeaderNames] = useState<string[]>(
    csvData.headers.map((x) => x.name)
  );
  const [numberTypeHeaders, setNumberTypeHeaders] = useState(
    csvData.headers.filter((x) => x.type === "number")
  );

  const [plotYOptions, setPlotYOptions] = useState(numberTypeHeaders);
  const [plotXOptions, setPlotXOptions] = useState<string[]>(headerNames);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!csvData) return;
    const headerNames = csvData.headers.map((x) => x.name);
    const numberTypeHeaders = csvData.headers.filter(
      (x) => x.type === "number"
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
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const options = e.target.options;
    const selectedValues: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    handleChartOptionsChange({
      plotX: chartOptions.plotX,
      plotY: selectedValues,
    });
    setPlotXOptions(headerNames.filter((x) => !selectedValues.includes(x)));
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChartOptionsChange({
      plotX: e.target.value,
      plotY: chartOptions.plotY,
    });
    setPlotYOptions(numberTypeHeaders.filter((x) => x.name !== e.target.value));
  };

  return (
    <>
      <div className="flex gap-2">
        <div className="flex flex-col">
          <label htmlFor="">Plot on x</label>
          <select
            name="plot-x"
            id="plot-x"
            onChange={handleSelectionChange}
            value={chartOptions.plotX ?? ""}
          >
            <option disabled value="">
              Select
            </option>
            {plotXOptions.map((header, i) => (
              <option key={`plot-x-${i}`} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Plot on y</label>
          <select
            name="plot-y"
            id="plot-y"
            value={chartOptions.plotY ?? [""]}
            multiple
            onChange={handleMultipleSelectionChange}
          >
            <option disabled value="">
              Select a number column
            </option>
            {plotYOptions.map((header, i) => (
              <option key={`plot-y-${i}`} value={header.name}>
                {header.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {chartOptions.plotX &&
        chartOptions.plotY &&
        chartOptions.plotY.length > 0 && (
          <BarChart
            height={400}
            dataset={csvData.rows}
            xAxis={[{ scaleType: "band", dataKey: chartOptions.plotX }]}
            series={chartOptions.plotY.map((x) => ({ dataKey: x, label: x }))}
          />
        )}
    </>
  );
}
