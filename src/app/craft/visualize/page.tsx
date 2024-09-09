"use client";

import ChartTabComponent from "@/components/ChartTab/ChartTab";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addTab, changeTab, removeTab } from "@/lib/features/appSlice";
import { useAppSelector } from "@/lib/hooks";
import { PlusCircle, X } from "lucide-react";
import { useDispatch } from "react-redux";

export default function VisualizePage() {
  const tabsData = useAppSelector((state) => state.app.tabsData);
  const currentTabIndex = useAppSelector((state) => state.app.currentTabIndex);
  const dispatch = useDispatch();

  const handleTabAdd = () => {
    dispatch(addTab());
  };

  const handleCloseTab = (index: number) => {
    dispatch(removeTab(index));
  };

  const handleTabChange = (index: number) => {
    dispatch(changeTab(index));
  };
  return (
    <>
      <Tabs
        value={currentTabIndex.toString()}
        onValueChange={(value) => handleTabChange(parseInt(value))}
        className="w-full"
      >
        <div className="flex items-center">
          <Button
            type="button"
            onClick={() => handleTabAdd()}
            size="sm"
            className="mr-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Tab
          </Button>
          <TabsList>
            {tabsData.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={`${index}`}
                className="flex items-center"
              >
                Tab {index + 1}
                <div
                  className="ml-2 p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCloseTab(index);
                  }}
                >
                  <X className="w-4 h-4" />
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {tabsData.map((tab, index) => (
          <TabsContent key={index} value={`${index}`}>
            <ChartTabComponent />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
