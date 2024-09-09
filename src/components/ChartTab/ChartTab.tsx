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
import { updateTabData } from "@/lib/features/appSlice";
import LineChartComponent from "../Charts/LineChart";
import PieChartCompnent from "../Charts/PieChart";
import TransformationsComponent from "../Transformations/Transformations";
import { CSVData } from "@/models/CSVData";
import TabTransformationsComponent from "../Transformations/TabTransformation";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export default function ChartTabComponent() {
  const currentTabIndex = useAppSelector((state) => state.app.currentTabIndex);
  const tabsData = useAppSelector((state) => state.app.tabsData);
  const tabData = tabsData[currentTabIndex];

  const dispatch = useAppDispatch();

  if (!tabData) {
    return <></>;
  }

  const handleTabDataChange = (updatedTabData: TabData) => {
    dispatch(updateTabData({ index: currentTabIndex, updatedTabData }));
  };

  const handleChartTypeChange = (value: ChartType) => {
    const newTabData = {
      ...tabData,
      chartType: value as ChartType,
    };
    handleTabDataChange(newTabData);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <TabTransformationsComponent />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-2 pt-6">
          <div className="flex gap-2 items-center">
            <div className="font-semibold text-xl">Chart Options: </div>
            <ToggleGroup
              type="single"
              value={tabData.chartType}
              onValueChange={handleChartTypeChange}
            >
              {availableChartOptions.map((opt, i) => (
                <ToggleGroupItem key={i} value={opt}>
                  {opt}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div>
            {tabData.chartType === ChartType.Bar && (
              <BarChartComponent
                chartOptions={tabData.chartOptions as BarChartOptions}
              />
            )}
            {tabData.chartType === ChartType.Line && (
              <LineChartComponent
                chartOptions={tabData.chartOptions as LineChartOptions}
              />
            )}
            {tabData.chartType === ChartType.Pie && (
              <PieChartCompnent
                chartOptions={tabData.chartOptions as PieChartOptions}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
