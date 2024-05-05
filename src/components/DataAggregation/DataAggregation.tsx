import {
  addAggregate,
  applyAggregations,
  removeAggregate,
  resetAggregations,
  updateAggregateColumn,
  updateAggregateOption,
  updateGroupByColumn,
} from "@/lib/features/tabs/tabsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { AggregateOptions, GroupByOptions } from "@/models/GroupByOptions";
import { useEffect } from "react";

export default function DataAggregationComponent() {
  const tabData = useAppSelector(
    (state) => state.tabs.data[state.tabs.currentTabIndex]
  );
  const csvData = useAppSelector((state) => state.filters.filteredData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!csvData) return;
    handleApplyAggregations();
  }, [csvData]);

  if (!csvData || !tabData) {
    return <></>;
  }

  const handleGroupByColumnChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(updateGroupByColumn(e.target.value));
  };

  const availableColumnsForAggregation = (index: number) => {
    return csvData.headers.filter(
      (header) =>
        header.type === "number" &&
        header.name !== tabData.groupByOption.groupBy &&
        !tabData.groupByOption.aggregates
          .filter((_, i) => i !== index)
          .map((opt) => opt.column)
          .includes(header.name)
    );
  };

  const handleAddAggregate = () => {
    dispatch(addAggregate());
  };

  const handleRemoveAggregate = (index: number) => {
    dispatch(removeAggregate(index));
  };

  const handleAggregateColumnChange = (index: number, column: string) => {
    dispatch(updateAggregateColumn({ index, column }));
  };

  const handleAggregateFunctionChange = (
    index: number,
    aggregateOption: string
  ) => {
    dispatch(
      updateAggregateOption({
        index,
        aggregateOption: aggregateOption as AggregateOptions,
      })
    );
  };

  const handleApplyAggregations = () => {
    dispatch(applyAggregations(csvData));
  };

  const handleResetAggregations = () => {
    dispatch(resetAggregations(csvData));
  };

  return (
    <>
      <div>Group By</div>
      <div className="flex gap-2">
        <div className="flex flex-col">
          <label htmlFor="groupBy">Column on Group By</label>
          <select
            name="groupBy"
            id="groupBy"
            value={tabData.groupByOption.groupBy ?? ""}
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
          {tabData.groupByOption.groupBy &&
            tabData.groupByOption.aggregates &&
            tabData.groupByOption.aggregates.length > 0 && (
              <>
                {tabData.groupByOption.aggregates.map((aggregate, i) => (
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
          {tabData.groupByOption.groupBy && (
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
          <button
            className="bg-yellow-500 p-2 ml-2"
            onClick={handleResetAggregations}
          >
            Reset Aggregations
          </button>
        </div>
      </div>
    </>
  );
}
