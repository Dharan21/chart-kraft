"use client";

import CSVReader from "@/components/CSVReader/CSVReader";
import ChartTabComponent from "@/components/ChartTab/ChartTab";
import DataFilterComponent from "@/components/DataFilter/DataFilter";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addTab, changeTab, removeTab } from "@/lib/features/tabs/tabsSlice";
import TableTabComponent from "@/components/TableTab/TableTab";

export default function Home() {
  const filtersData = useAppSelector((state) => state.filters);
  const tabsData = useAppSelector((state) => state.tabs);
  const dispatch = useAppDispatch();

  const handleTabAdd = () => {
    dispatch(addTab(filtersData.filteredData ?? { headers: [], rows: [] }));
  };

  const handleCloseTab = (index: number) => {
    dispatch(removeTab(index));
  };

  const handleTabChange = (index: number) => {
    dispatch(changeTab(index));
  };

  return (
    <div className="h-[100vh] overflow-hidden">
      <h1 className="text-2xl font-bold mb-4 text-center  h-[15vh]">
        ChartCraft
      </h1>
      <div className="flex h-[80vh]">
        <div className="w-4/5">
          {filtersData.filteredData && (
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
                  <button
                    type="button"
                    className={`w-1/12 p-2 text-white ${
                      tabsData.currentTabIndex === -1
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                    onClick={() => handleTabChange(-1)}
                  >
                    Table
                  </button>
                  {tabsData.data.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-1/12 p-2 text-white ${
                        tabsData.currentTabIndex === index
                          ? "bg-blue-500"
                          : "bg-gray-500"
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
              {tabsData.currentTabIndex > -1 ? <ChartTabComponent /> : <TableTabComponent />}
            </>
          )}
        </div>
        <div className="w-1/5">
          <div className="flex flex-col">
            <CSVReader />
            {filtersData.data && <DataFilterComponent />}
          </div>
        </div>
      </div>
    </div>
  );
}
