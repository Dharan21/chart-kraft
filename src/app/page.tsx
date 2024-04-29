"use client";

import CSVReader from "@/components/CSVReader/CSVReader";
import ChartTabComponent from "@/components/ChartTab/ChartTab";
import DataFilterComponent from "@/components/DataFilter/DataFilter";
import { CSVData } from "@/models/CSVData";
import { ChartOptions } from "@/models/ChartOptions";
import { GroupByOption } from "@/models/GroupByOptions";
import { TabData } from "@/models/TabData";
import React, { useState } from "react";
import StoreProvider from "./StoreProvider";

const newEmptyTabData: TabData = {
  chartType: "bar",
  chartOptions: {} as ChartOptions,
  GroupByOption: {
    groupBy: "",
    aggregates: [{ column: "", aggregateOption: "" }],
  } as GroupByOption,
};

export default function Home() {
  const [csvData, setCSVData] = useState<CSVData | undefined>(undefined);
  const [filteredData, setFilteredData] = useState<CSVData | undefined>(
    undefined
  );
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [tabsData, setTabsData] = React.useState<TabData[]>([newEmptyTabData]);

  const handleCSVData = (data: CSVData) => {
    setCSVData(data);
    setFilteredData(data);
  };

  const handleTabAdd = () => {
    setTabsData((prev) => [...prev, newEmptyTabData]);
    setSelectedTab(tabsData.length);
  };

  const handleCloseTab = (index: number) => {
    if (tabsData.length === 1) {
      return;
    }
    if (tabsData.length - 1 === index) {
      setSelectedTab(index - 1);
    }
    setTabsData((prevTabsData) => {
      const newTabsData = prevTabsData.filter((_, i) => i !== index);
      return newTabsData;
    });
  };

  const handleTabChange = (index: number) => {
    if (index >= 0 && index < tabsData.length) {
      setSelectedTab(index);
    } else {
      setSelectedTab(tabsData.length - 1);
    }
  };

  const handleTabDataChange = (index: number, updatedTabData: TabData) => {
    console.log(updatedTabData);
    setTabsData((prevTabsData) => {
      const newTabsData = [...prevTabsData];
      newTabsData[index] = updatedTabData;
      return newTabsData;
    });
  };

  return (
    <StoreProvider>
      <div className="h-[100vh] overflow-hidden">
        <h1 className="text-2xl font-bold mb-4 text-center  h-[15vh]">
          ChartCraft
        </h1>
        <div className="flex h-[80vh]">
          <div className="w-4/5">
            {filteredData && (
              // csvData.length > 0 &&
              <>
                <div className="flex">
                  <div className="w-1/12">
                    <button
                      onClick={handleTabAdd}
                      type="button"
                      className="bg-blue-500 text-white p-2 rounded-md"
                    >
                      Add Tab
                    </button>
                  </div>
                  <div className="w-11/12">
                    {tabsData.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`w-1/12 p-2 text-white ${
                          selectedTab === index ? "bg-blue-500" : "bg-gray-500"
                        }`}
                        onClick={() => handleTabChange(index)}
                      >
                        <span>Tab {index + 1}</span>
                        <span
                          className="bg-red-500 text-white rounded-full p-1 ml-2 cursor-pointer"
                          onClick={() => handleCloseTab(index)}
                        >
                          x
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <ChartTabComponent
                  tabData={tabsData[selectedTab]}
                  csvData={filteredData}
                  onTabDataChange={(updatedTabData) =>
                    handleTabDataChange(selectedTab, updatedTabData)
                  }
                />
              </>
            )}
          </div>
          <div className="w-1/5">
            <div className="flex flex-col">
              <CSVReader onCSVData={handleCSVData} />
              {csvData && (
                <DataFilterComponent
                  csvData={csvData}
                  onFilterData={(data) => setFilteredData(data)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}
