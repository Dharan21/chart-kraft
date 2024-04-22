import { CSVData } from "@/models/CSVData";
import { BarChartOptions } from "@/models/ChartOptions";
import { BarChart } from "@mui/x-charts";
import { useState } from "react";

type BarChartProps = {
  csvData: CSVData;
  chartOptions: BarChartOptions;
  onChartOptionsChange: (options: BarChartOptions) => void;
};

export default function BarChartComponent({
  csvData,
  chartOptions,
  onChartOptionsChange,
}: BarChartProps) {
  const headerNames = csvData.headers.map((x) => x.name);
  const numberTypeHeaders = csvData.headers.filter((x) => x.type === "number");

  const [plotYOptions, setPlotYOptions] = useState(numberTypeHeaders);
  const [plotXOptions, setPlotXOptions] = useState<string[]>(headerNames);
  const [selectedPlotXvalue, setSelectedPlotXValue] = useState<string>(
    chartOptions.plotX ?? ""
  );
  const [selectedPlotYValues, setSelectedPlotYValues] = useState<string[]>(
    chartOptions.plotY
  );

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
    setSelectedPlotYValues(selectedValues);
    onChartOptionsChange({ plotX: selectedPlotXvalue, plotY: selectedValues });
    setPlotXOptions(headerNames.filter((x) => !selectedValues.includes(x)));
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlotXValue(e.target.value);
    onChartOptionsChange({ plotX: e.target.value, plotY: selectedPlotYValues });
    setPlotYOptions(numberTypeHeaders.filter((x) => x.name !== e.target.value));
  };

  return (
    <>
      <div className="flex">
        <div className="flex flex-col">
          <label htmlFor="">Plot on x</label>
          <select
            name="plot-x"
            id="plot-x"
            onChange={handleSelectionChange}
            value={selectedPlotXvalue}
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
            value={selectedPlotYValues}
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
      {selectedPlotXvalue &&
        selectedPlotYValues &&
        selectedPlotYValues.length > 0 && (
          <BarChart
            height={400}
            dataset={csvData.rows}
            xAxis={[{ scaleType: "band", dataKey: selectedPlotXvalue }]}
            series={selectedPlotYValues.map((x) => ({ dataKey: x, label: x }))}
          />
        )}
    </>
  );
}
