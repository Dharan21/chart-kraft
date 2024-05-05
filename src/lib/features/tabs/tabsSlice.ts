import { CSVData } from "@/models/CSVData";
import { ChartOptions } from "@/models/ChartOptions";
import { AggregateOptions, GroupByOption } from "@/models/GroupByOptions";
import { TabData } from "@/models/TabData";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface TabsState {
  data: TabData[];
  currentTabIndex: number;
}

const newEmptyTabData = (data: CSVData): TabData => ({
  chartType: "bar",
  chartOptions: {} as ChartOptions,
  groupByOption: {
    groupBy: "",
    aggregates: [{ column: "", aggregateOption: "" }],
  } as GroupByOption,
  aggregatedData: data,
});

const initialState: TabsState = {
  data: [newEmptyTabData({ headers: [], rows: [] })],
  currentTabIndex: -1,
};

export const TabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<CSVData>) => {
      state.data.push(newEmptyTabData(action.payload));
      state.currentTabIndex = state.data.length - 1;
    },
    changeTab: (state, action: PayloadAction<number>) => {
      if (action.payload >= -1 && action.payload < state.data.length) {
        state.currentTabIndex = action.payload;
      }
    },
    removeTab: (state, action: PayloadAction<number>) => {
      if (state.data.length === 1) return state;
      state.data = state.data.filter((_, index) => index !== action.payload);
    },
    updateTabData: (
      state,
      action: PayloadAction<{ index: number; updatedTabData: TabData }>
    ) => {
      const { index, updatedTabData } = action.payload;
      state.data[index] = updatedTabData;
    },
    updateChartOptions: (state, action: PayloadAction<ChartOptions>) => {
      state.data[state.currentTabIndex].chartOptions = action.payload;
    },
    addAggregate: (state) => {
      state.data[state.currentTabIndex].groupByOption.aggregates.push({
        column: "",
        aggregateOption: "",
      });
    },
    removeAggregate: (state, action: PayloadAction<number>) => {
      state.data[state.currentTabIndex].groupByOption.aggregates = state.data[
        state.currentTabIndex
      ].groupByOption.aggregates.filter((_, index) => index !== action.payload);
    },
    updateGroupByColumn: (state, action: PayloadAction<string>) => {
      state.data[state.currentTabIndex].groupByOption.groupBy = action.payload;
    },
    updateAggregateColumn: (
      state,
      action: PayloadAction<{ index: number; column: string }>
    ) => {
      state.data[state.currentTabIndex].groupByOption.aggregates[
        action.payload.index
      ].column = action.payload.column;
    },
    updateAggregateOption: (
      state,
      action: PayloadAction<{
        index: number;
        aggregateOption: AggregateOptions;
      }>
    ) => {
      state.data[state.currentTabIndex].groupByOption.aggregates[
        action.payload.index
      ].aggregateOption = action.payload.aggregateOption;
    },
    applyAggregations: (state, action: PayloadAction<CSVData>) => {
      const { groupBy, aggregates } =
        state.data[state.currentTabIndex].groupByOption;
      if (!groupBy || aggregates.length === 0) {
        return state;
      }

      const aggregatedData = aggregate({
        csvData: action.payload,
        groupByOption: state.data[state.currentTabIndex].groupByOption,
      });

      state.data[state.currentTabIndex].aggregatedData = aggregatedData;
    },
    resetAggregations: (state, action: PayloadAction<CSVData>) => {
      state.data[state.currentTabIndex].groupByOption = {
        groupBy: "",
        aggregates: [{ column: "", aggregateOption: "" }],
      };
      state.data[state.currentTabIndex].aggregatedData = action.payload;
      state.data[state.currentTabIndex].chartOptions = {} as ChartOptions;
    },
    resetTabs: (state, action: PayloadAction<CSVData>) => {
      state.data = [newEmptyTabData(action.payload)];
      state.currentTabIndex = -1;
    },
  },
});

const aggregate = ({
  csvData,
  groupByOption,
}: {
  csvData: CSVData;
  groupByOption: GroupByOption;
}): CSVData => {
  const { groupBy, aggregates } = groupByOption;
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

  return {
    headers: newHeaders,
    rows: newRows,
  };
};

export const {
  addTab,
  removeTab,
  updateTabData,
  changeTab,
  resetTabs,
  updateChartOptions,
  updateGroupByColumn,
  addAggregate,
  removeAggregate,
  applyAggregations,
  updateAggregateColumn,
  updateAggregateOption,
  resetAggregations,
} = TabsSlice.actions;
export default TabsSlice.reducer;
