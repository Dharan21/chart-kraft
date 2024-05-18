"use client";

import CSVReader from "@/components/CSVReader/CSVReader";
import ChartTabComponent from "@/components/ChartTab/ChartTab";
import DataFilterComponent from "@/components/DataFilter/DataFilter";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addTab, changeTab, removeTab } from "@/lib/features/tabs/tabsSlice";
import TableTabComponent from "@/components/TableTab/TableTab";
import { ImCross } from "react-icons/im";

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
    <div className="min-h-[100vh]">
      <h1 className="text-2xl font-bold text-center">ChartCraft</h1>
      <div className="flex">
        <div className="w-4/5">
          {filtersData.filteredData && (
            <>
              <div className="flex">
                <div className="w-1/12">
                  <button
                    onClick={handleTabAdd}
                    type="button"
                    className="bg-primary p-2 rounded-md"
                  >
                    Add Tab
                  </button>
                </div>
                <div className="w-11/12">
                  <button
                    type="button"
                    className={`w-1/12 p-2 ${
                      tabsData.currentTabIndex === -1
                        ? "bg-primary"
                        : "bg-disabled"
                    }`}
                    onClick={() => handleTabChange(-1)}
                  >
                    Table
                  </button>
                  {tabsData.data.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-1/12 p-2 ${
                        tabsData.currentTabIndex === index
                          ? "bg-primary"
                          : "bg-disabled"
                      }`}
                      onClick={() => handleTabChange(index)}
                    >
                      <div className="flex flex-row justify-center align-center gap-2">
                        <div>Tab {index + 1}</div>
                        <div onClick={() => handleCloseTab(index)}>
                          <ImCross className="h-full text-danger" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {tabsData.currentTabIndex > -1 ? (
                <ChartTabComponent />
              ) : (
                <TableTabComponent />
              )}
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
