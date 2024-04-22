import { CSVData } from "@/models/CSVData";
import { ChartType, TabData } from "@/models/TabData";
import BarChartComponent from "../Charts/BarChart";
import { BarChartOptions, ChartOptions } from "@/models/ChartOptions";

type ChartTabProps = {
  tabData: TabData;
  csvData: CSVData;
  onTabDataChange: (updatedTabData: TabData) => void;
};

export default function ChartTabComponent({
  tabData,
  csvData,
  onTabDataChange,
}: ChartTabProps) {
  const tabDataCopy: TabData = !!tabData
    ? JSON.parse(JSON.stringify(tabData))
    : { chartType: "line" };

  const handleTabDataChange = (updatedTabData: TabData) => {
    onTabDataChange(updatedTabData);
  };

  const handleChartTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTabData = {
      ...tabDataCopy,
      chartType: e.target.value as ChartType,
    };
    handleTabDataChange(newTabData);
  };

  const handleChartOptionsChange = (newChartOptions: ChartOptions) => {
    const newTabData = {
      ...tabDataCopy,
      chartOptions: newChartOptions,
    };
    handleTabDataChange(newTabData);
  };

  return (
    <>
      <div className="flex h-[65vh]">
        <div className="w-1/12">
          <div className="flex flex-col">
            <div className="p-2">Chart Types</div>
            <div className="p-2">
              <select
                name="chart-type"
                id=""
                value={tabDataCopy.chartType}
                onChange={handleChartTypeChange}
              >
                <option value="bar">bar</option>
                <option value="line">line</option>
              </select>
            </div>
          </div>
        </div>
        <div className="w-11/12">
          {tabDataCopy.chartType === "bar" && (
            <BarChartComponent
              csvData={csvData}
              chartOptions={tabData.chartOptions as BarChartOptions}
              onChartOptionsChange={handleChartOptionsChange}
            />
          )}
        </div>
      </div>
    </>
  );
}
