import { CSVData } from "@/models/CSVData";
import { ChartOptions } from "@/models/ChartOptions";
import { AggregateOption, GroupByOption } from "@/models/GroupByOptions";
import { TabData } from "@/models/TabData";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface TabsState {
  data: TabData[];
  currentTabIndex: number;
}

const newEmptyTabData = (data: CSVData): TabData => ({
  chartType: "bar",
  chartOptions: {} as ChartOptions,
  inputData: data,
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
    resetTabs: (state, action: PayloadAction<CSVData>) => {
      state.data = [newEmptyTabData(action.payload)];
      state.currentTabIndex = -1;
    },
  },
});


export const {
  addTab,
  removeTab,
  updateTabData,
  changeTab,
  resetTabs,
  updateChartOptions,
} = TabsSlice.actions;
export default TabsSlice.reducer;
