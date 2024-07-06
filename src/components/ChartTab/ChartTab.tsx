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
import LineChartComponent from "../Charts/LineChart";
import PieChartCompnent from "../Charts/PieChart";
import TransformationsComponent from "../Transformations/Transformations";
import { CSVData } from "@/models/CSVData";
import TabTransformationsComponent from "../Transformations/TabTransformation";

export default function ChartTabComponent() {
  const currentTabIndex = useAppSelector((state) => state.tabs.currentTabIndex);
  const tabsData = useAppSelector((state) => state.tabs.data);
  const tabData = tabsData[currentTabIndex];

  const dispatch = useAppDispatch();

  if (!tabData) {
    return <></>;
  }

  const handleTransformedData = (data: CSVData) => {
    const newTabData = {
      ...tabData,
      transformedData: data,
    } as TabData;
    handleTabDataChange(newTabData);
  };

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
        <div className="w-1/6">
          <div className="flex flex-col gap-2">
            <div>Chart Types</div>
            <div>
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
            <div>
              <TabTransformationsComponent
                csvData={tabData.inputData}
                handleTransformedData={handleTransformedData}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-5/6">
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
