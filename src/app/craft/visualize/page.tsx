"use client";

import ChartTabComponent from "@/components/ChartTab/ChartTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addTab, changeTab, removeTab } from "@/lib/features/appSlice";
import { useAppSelector } from "@/lib/hooks";
import { PlusCircle, X } from "lucide-react";
import { useDispatch } from "react-redux";

export default function VisualizePage() {
  const tabsData = useAppSelector((state) => state.app.tabsData);
  const currentTabIndex = useAppSelector((state) => state.app.currentTabIndex);
  const dispatch = useDispatch();
  const canClose = tabsData.length > 1;

  return (
    <>
      <h1 className="sr-only">Visualize your data</h1>
      <Tabs
        value={currentTabIndex.toString()}
        onValueChange={(value) => dispatch(changeTab(parseInt(value)))}
        className="w-full"
      >
        <div className="flex h-fit w-full items-center gap-2 overflow-x-auto pb-1">
          <Button
            type="button"
            onClick={() => dispatch(addTab())}
            size="sm"
            className="shrink-0"
          >
            <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
            Add Tab
          </Button>
          <TabsList className="flex h-auto flex-wrap gap-1">
            {tabsData.map((_, index) => (
              <div key={index} className="flex items-center">
                <TabsTrigger
                  value={`${index}`}
                  className="min-h-9 rounded-r-none pr-2"
                >
                  Tab {index + 1}
                </TabsTrigger>
                {canClose && (
                  <button
                    type="button"
                    aria-label={`Close tab ${index + 1}`}
                    onClick={() => dispatch(removeTab(index))}
                    className="inline-flex min-h-9 items-center rounded-r-sm px-2 text-muted-foreground hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
          </TabsList>
        </div>
        {tabsData.map((_, index) => (
          <TabsContent key={index} value={`${index}`}>
            <ChartTabComponent />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
