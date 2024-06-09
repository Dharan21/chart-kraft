import { updateChartOptions } from "@/lib/features/tabs/tabsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { PieChartOptions } from "@/models/ChartOptions";
import { PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";

type PieChartProps = {
  chartOptions: PieChartOptions;
};

export default function PieChartCompnent({ chartOptions }: PieChartProps) {
  const csvData = useAppSelector(
    (state) => state.tabs.data[state.tabs.currentTabIndex].inputData
  );

  const [headerNames, setHeaderNames] = useState<string[]>(
    csvData.headers.map((x) => x.name)
  );
  const [numberTypeHeaders, setNumberTypeHeaders] = useState(
    csvData.headers.filter((x) => x.type === "number")
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!csvData) return;
    setHeaderNames(csvData.headers.map((x) => x.name));
    setNumberTypeHeaders(csvData.headers.filter((x) => x.type === "number"));
  }, [csvData]);

  const handleChartOptionsChange = (chartOptions: PieChartOptions) => {
    dispatch(updateChartOptions(chartOptions));
  };

  const handleSelectionChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    change: "value" | "label"
  ) => {
    const updatedChartOptions = {
      valueColumn:
        change === "value" ? e.target.value : chartOptions.valueColumn,
      labelColumn:
        change === "label" ? e.target.value : chartOptions.labelColumn,
    };
    handleChartOptionsChange(updatedChartOptions);
  };

  return (
    <>
      <div className="flex gap-2">
        <div className="flex flex-col">
          <label htmlFor="">Select Label To Show</label>
          <select
            name="plot-x"
            id="plot-x"
            onChange={(e) => handleSelectionChange(e, "label")}
            value={chartOptions.labelColumn ?? ""}
          >
            <option disabled value="">
              Select
            </option>
            {headerNames.map((header, i) => (
              <option key={`plot-x-${i}`} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Select Column</label>
          <select
            name="plot-x"
            id="plot-x"
            onChange={(e) => handleSelectionChange(e, "value")}
            value={chartOptions.valueColumn ?? ""}
          >
            <option disabled value="">
              Select
            </option>
            {numberTypeHeaders.map((header, i) => (
              <option key={`plot-x-${i}`} value={header.name}>
                {header.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {chartOptions.valueColumn && (
        <PieChart
          height={400}
          series={[
            {
              data: csvData.rows
                .filter((x) => !!x[chartOptions.valueColumn])
                .map((row) => ({
                  label: (row[chartOptions.labelColumn] as string) ?? "",
                  value: row[chartOptions.valueColumn] as number,
                })),
            },
          ]}
          
        />
      )}
    </>
  );
}
