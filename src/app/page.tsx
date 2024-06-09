"use client";

import CSVReader from "@/components/CSVReader/CSVReader";
import ChartTabComponent from "@/components/ChartTab/ChartTab";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addTab, changeTab, removeTab, resetTabs } from "@/lib/features/tabs/tabsSlice";
import TableTabComponent from "@/components/TableTab/TableTab";
import TransformationsComponent from "@/components/Transformations/Transformations";
import { CSVData } from "@/models/CSVData";
import { MdDelete } from "react-icons/md";

export default function Home() {
  const tabsData = useAppSelector((state) => state.tabs);
  const dispatch = useAppDispatch();

  const [data, setData] = React.useState<CSVData>({
    rows: [],
    headers: [],
  } as CSVData);

  const handleTabAdd = () => {
    if (!data) {
      alert("Please upload a file first");
      return;
    }
    dispatch(addTab(data));
  };

  const handleCloseTab = (index: number) => {
    dispatch(removeTab(index));
  };

  const handleTabChange = (index: number) => {
    dispatch(changeTab(index));
  };

  const handleTransformedData = (data: CSVData) => {
    if (!!data) {
      if (tabsData.data.length > 0) {
        const res = confirm(
          "This action will reset your current data. Are you sure you want to proceed?"
        );
        if (res) {
          setData(data);
          dispatch(resetTabs(data));
        }
      } else {
        setData(data);
      }
    }
  };

  const onDataLoad = (data: CSVData) => {
    setData(data);
  };

  const isDataAvailable = () => !!data && !!data.rows && data.rows.length > 0;

  return (
    <div className="min-h-[100vh]">
      <h1 className="text-2xl font-bold text-center">ChartCraft</h1>
      <div className="flex">
        <div className="w-4/5">
          {isDataAvailable() && (
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
                          <MdDelete className="h-full" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {tabsData.currentTabIndex > -1 ? (
                <ChartTabComponent />
              ) : (
                <TableTabComponent csvData={data} />
              )}
            </>
          )}
        </div>
        <div className="w-1/5">
          <div className="flex flex-col">
            <CSVReader onLoad={onDataLoad} />
            {isDataAvailable() && (
              <TransformationsComponent
                csvData={data}
                handleTransformedData={handleTransformedData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
