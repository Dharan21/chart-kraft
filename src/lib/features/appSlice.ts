import { CSVData } from "@/models/CSVData";
import { ChartOptions, ChartType } from "@/models/ChartOptions";
import { TabData } from "@/models/TabData";
import { Transformation, TransformationType } from "@/models/Transformation";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { add } from "date-fns";

export interface AppState {
  uploadedCsvData: CSVData;
  globalTransformations: Transformation[];
  transformedCsvData: CSVData;
  tabsData: TabData[];
  currentTabIndex: number;
}

const newEmptyTabData = (data: CSVData): TabData => ({
  chartType: ChartType.Bar,
  chartOptions: {} as ChartOptions,
  inputData: data,
  transformedData: data,
  transformations: [],
});

const initialState: AppState = {
  uploadedCsvData: { headers: [], rows: [] },
  globalTransformations: [],
  transformedCsvData: { headers: [], rows: [] },
  tabsData: [newEmptyTabData({ headers: [], rows: [] })],
  currentTabIndex: -1,
};

export const AppSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    setUploadedCsvData: (state, action: PayloadAction<CSVData>) => {
      state.uploadedCsvData = action.payload;
      state.globalTransformations = [];
      state.transformedCsvData = action.payload;
      state.tabsData = [newEmptyTabData(action.payload)];
      state.currentTabIndex = 0;
    },
    addGlobalTransformation: (
      state,
      action: PayloadAction<TransformationType>
    ) => {
      if (state.globalTransformations.length == 0) {
        state.globalTransformations = [
          {
            inputData: state.uploadedCsvData,
            type: action.payload,
          } as Transformation,
        ];
      } else {
        state.globalTransformations.push({
          inputData:
            state.globalTransformations[state.globalTransformations.length - 1]
              .outputData,
          type: action.payload,
        } as Transformation);
      }
    },
    updateGlobalTransformation: (
      state,
      action: PayloadAction<{ index: number; transformation: Transformation }>
    ) => {
      const { index, transformation } = action.payload;
      const newTransformations = [...state.globalTransformations];
      newTransformations[index] = transformation;
      state.globalTransformations = newTransformations;
    },
    deleteGlobalTransformation: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      let newTransformations = [...state.globalTransformations];
      newTransformations.splice(index);
      state.globalTransformations = newTransformations;
    },
    resetGlobalTransformations: (state) => {
      state.globalTransformations = [];
      state.transformedCsvData = state.uploadedCsvData;
      state.tabsData = [newEmptyTabData(state.uploadedCsvData)];
      state.currentTabIndex = 0;
    },
    applyGlobalTransformations: (state) => {
      const outputData =
        state.globalTransformations[state.globalTransformations.length - 1]
          .outputData;
      if (!outputData) return;
      state.transformedCsvData = outputData;
      state.tabsData = [newEmptyTabData(outputData)];
      state.currentTabIndex = 0;
    },
    addTab: (state) => {
      state.tabsData.push(newEmptyTabData(state.transformedCsvData));
      state.currentTabIndex = state.tabsData.length - 1;
    },
    changeTab: (state, action: PayloadAction<number>) => {
      if (action.payload >= -1 && action.payload < state.tabsData.length) {
        state.currentTabIndex = action.payload;
      }
    },
    removeTab: (state, action: PayloadAction<number>) => {
      if (state.tabsData.length === 1) return state;
      state.tabsData = state.tabsData.filter(
        (_, index) => index !== action.payload
      );
    },
    updateTabData: (
      state,
      action: PayloadAction<{ index: number; updatedTabData: TabData }>
    ) => {
      const { index, updatedTabData } = action.payload;
      state.tabsData[index] = updatedTabData;
    },
    updateTabTransformations: (
      state,
      action: PayloadAction<Transformation[]>
    ) => {
      state.tabsData[state.currentTabIndex].transformations = action.payload;
    },
    updateChartOptions: (state, action: PayloadAction<ChartOptions>) => {
      state.tabsData[state.currentTabIndex].chartOptions = action.payload;
    },
    resetTabs: (state) => {
      state.tabsData = [newEmptyTabData(state.transformedCsvData)];
      state.currentTabIndex = 0;
    },
  },
});

export const {
  setUploadedCsvData,
  addGlobalTransformation,
  updateGlobalTransformation,
  deleteGlobalTransformation,
  resetGlobalTransformations,
  applyGlobalTransformations,
  addTab,
  removeTab,
  updateTabData,
  updateTabTransformations,
  changeTab,
  resetTabs,
  updateChartOptions,
} = AppSlice.actions;
export default AppSlice.reducer;
