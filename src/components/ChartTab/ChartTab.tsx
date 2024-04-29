import { CSVData } from "@/models/CSVData";
import { ChartType, TabData } from "@/models/TabData";
import BarChartComponent from "../Charts/BarChart";
import { BarChartOptions, ChartOptions } from "@/models/ChartOptions";
import { useEffect, useState } from "react";
import { headers } from "next/headers";
import { AggregateOptions, GroupByOptions } from "@/models/GroupByOptions";

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
  const [groupByOption, setGroupByOption] = useState(tabDataCopy.GroupByOption);

  useEffect(() => {
    applyAggregations();
  }, []);

  const handleGroupByColumnChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setGroupByOption((prev) => ({ ...prev, groupBy: e.target.value }));
  };

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

  const availableColumnsForAggregation = (index: number) => {
    return csvData.headers.filter(
      (header) =>
        header.type === "number" &&
        header.name !== groupByOption.groupBy &&
        !groupByOption.aggregates
          .filter((_, i) => i !== index)
          .map((opt) => opt.column)
          .includes(header.name)
    );
  };

  const handleAddAggregate = () => {
    setGroupByOption((prev) => ({
      ...prev,
      aggregates: [...prev.aggregates, { column: "", aggregateOption: "" }],
    }));
  };

  const handleRemoveAggregate = (index: number) => {
    setGroupByOption((prev) => ({
      ...prev,
      aggregates: prev.aggregates.filter((_, i) => i !== index),
    }));
  };

  const handleAggregateColumnChange = (index: number, column: string) => {
    setGroupByOption((prev) => {
      const newAggregates = [...prev.aggregates];
      newAggregates[index] = { ...newAggregates[index], column };
      return { ...prev, aggregates: newAggregates };
    });
  };

  const handleAggregateFunctionChange = (
    index: number,
    aggregateOption: string
  ) => {
    setGroupByOption((prev) => {
      const newAggregates = [...prev.aggregates];
      newAggregates[index] = {
        ...newAggregates[index],
        aggregateOption: aggregateOption as AggregateOptions,
      };
      return { ...prev, aggregates: newAggregates };
    });
  };

  const handleApplyAggregations = () => {
    // applyAggregations();
    const newTabData = {
      ...tabDataCopy,
      GroupByOption: groupByOption,
    };
    handleTabDataChange(newTabData);
  };

  const applyAggregations = () => {
    const { groupBy, aggregates } = groupByOption;
    if (!groupBy || aggregates.length === 0) {
      return csvData;
    }

    const newRows = csvData.rows.reduce((obj, cur) => {
      const currentval = cur[groupBy] as string;
      let match = obj.find((x) => x[groupBy] === currentval);
      if (!match) {
        obj.push({ [groupBy]: currentval });
      }
      match = obj.find((x) => x[groupBy] === currentval);
      if (match) {
        aggregates.forEach((aggregate) => {
          const columnValue = cur[aggregate.column] as number;
          const aggregateVal = match[aggregate.column] as number;
          if (columnValue) {
            switch (aggregate.aggregateOption) {
              case "sum":
                match[aggregate.column] = (aggregateVal ?? 0) + columnValue;
                break;
              case "avg":
                match[aggregate.column] = (aggregateVal ?? 0) + columnValue;
                break;
              case "count":
                match[aggregate.column] = (aggregateVal ?? 0) + 1;
                break;
              case "min":
                match[aggregate.column] = Math.min(
                  aggregateVal ?? columnValue,
                  columnValue
                );
                break;
              case "max":
                match[aggregate.column] = Math.max(
                  aggregateVal ?? columnValue,
                  columnValue
                );
                break;
            }
          }
        });
      }
      return obj;
    }, [] as { [x: string]: string | number | null }[]);

    const newHeaders = csvData.headers.filter(
      (header) =>
        header.name === groupBy ||
        aggregates.map((opt) => opt.column).includes(header.name)
    );

    console.log({ headers: newHeaders, rows: newRows });
    return { headers: newHeaders, rows: newRows };
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
        <div className="flex flex-col w-11/12">
          <div>Group By</div>
          <div className="flex">
            <div className="flex flex-col">
              <label htmlFor="groupBy">Column on Group By</label>
              <select
                name="groupBy"
                id="groupBy"
                value={groupByOption.groupBy ?? ""}
                onChange={handleGroupByColumnChange}
              >
                <option value="" disabled>
                  Select
                </option>
                {csvData.headers.map((header) => (
                  <option key={header.name} value={header.name}>
                    {header.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex">
              {groupByOption.groupBy &&
                groupByOption.aggregates &&
                groupByOption.aggregates.length > 0 && (
                  <>
                    {groupByOption.aggregates.map((aggregate, i) => (
                      <div key={i}>
                        <div className="flex flex-col">
                          <button
                            className="bg-red-500 p-2 mb-2 mr-2"
                            onClick={() => handleRemoveAggregate(i)}
                          >
                            Remove
                          </button>
                          <label htmlFor={`aggr-col-${i}`}>
                            Aggregation Function On Column
                          </label>
                          <select
                            name={`aggr-col-${i}`}
                            id={`aggr-col-${i}`}
                            value={aggregate.column}
                            onChange={(e) =>
                              handleAggregateColumnChange(i, e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            {availableColumnsForAggregation(i).map((header) => (
                              <option key={header.name} value={header.name}>
                                {header.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor={`aggr-fn-${i}`}>
                            Aggregation Function
                          </label>
                          <select
                            name={`aggr-fn-${i}`}
                            id={`aggr-fn-${i}`}
                            onChange={(e) =>
                              handleAggregateFunctionChange(i, e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            {GroupByOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              {groupByOption.groupBy && (
                <>
                  <button
                    className="bg-blue-500 p-2 ml-2"
                    onClick={handleAddAggregate}
                  >
                    Add
                  </button>
                  <button
                    className="bg-green-500 p-2 ml-2"
                    onClick={handleApplyAggregations}
                  >
                    Apply
                  </button>
                </>
              )}
            </div>
          </div>

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
