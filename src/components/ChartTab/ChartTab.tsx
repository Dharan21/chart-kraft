import { TabData } from "@/models/TabData";
import BarChartComponent from "../Charts/BarChart";
import {
  BarChartOptions,
  ChartType,
  LineChartOptions,
  PieChartOptions,
  availableChartOptions,
} from "@/models/ChartOptions";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateTabData } from "@/lib/features/tabs/tabsSlice";
import DataAggregationComponent from "../DataAggregation/DataAggregation";
import LineChartComponent from "../Charts/LineChart";
import PieChartCompnent from "../Charts/PieChart";

export default function ChartTabComponent() {
  const csvData = useAppSelector((state) => state.filters.filteredData);
  const currentTabIndex = useAppSelector((state) => state.tabs.currentTabIndex);
  const tabsData = useAppSelector((state) => state.tabs.data);
  const tabData = tabsData[currentTabIndex];

  const dispatch = useAppDispatch();

  if (!csvData || !tabData) {
    return <></>;
  }

  const handleTabDataChange = (updatedTabData: TabData) => {
    dispatch(updateTabData({ index: currentTabIndex, updatedTabData }));
  };

  const handleChartTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTabData = {
      ...tabData,
      chartType: e.target.value as ChartType,
    };
    handleTabDataChange(newTabData);
  };

  return (
    <>
      <div className="flex">
        <div className="w-1/12">
          <div className="flex flex-col">
            <div className="p-2">Chart Types</div>
            <div className="p-2">
              <select
                name="chart-type"
                id=""
                value={tabData.chartType}
                onChange={handleChartTypeChange}
              >
                {availableChartOptions.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-11/12">
          <DataAggregationComponent />
          {tabData.chartType === "bar" && (
            <BarChartComponent
              chartOptions={tabData.chartOptions as BarChartOptions}
            />
          )}
          {tabData.chartType === "line" && (
            <LineChartComponent
              chartOptions={tabData.chartOptions as LineChartOptions}
            />
          )}
          {tabData.chartType === "pie" && (
            <PieChartCompnent
              chartOptions={tabData.chartOptions as PieChartOptions}
            />
          )}
        </div>
      </div>
    </>
  );
}
