import { CSVData, SupportedDataType } from "@/models/CSVData";
import { FilterOptions, FilterRow } from "@/models/FilterOptions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type FiltersState = {
  data: CSVData | undefined;
  filters: FilterRow[];
  filteredData: CSVData | undefined;
};

const initialState: FiltersState = {
  data: undefined,
  filters: [],
  filteredData: undefined,
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    addFileData: (state, action: PayloadAction<CSVData>) => {
      state.data = action.payload;
      state.filteredData = action.payload;
    },
    addFilter: (state) => {
      state.filters.push({ header: "", dataType: "", type: "", value: "" });
    },
    setFilterType: (
      state,
      action: PayloadAction<{ index: number; value: FilterOptions }>
    ) => {
      state.filters[action.payload.index].type = action.payload.value;
    },
    setFilterHeader: (
      state,
      action: PayloadAction<{
        index: number;
        header: string;
        type: SupportedDataType;
      }>
    ) => {
      state.filters[action.payload.index].header = action.payload.header;
      state.filters[action.payload.index].dataType = action.payload.type;
    },
    setFilterValue: (
      state,
      action: PayloadAction<{ index: number; value: string }>
    ) => {
      state.filters[action.payload.index].value = action.payload.value;
    },
    removeFilter: (state, action: PayloadAction<number>) => {
      state.filters.splice(action.payload, 1);
    },
    applyFilters: (state) => {
      let filteredData = state.data?.rows ?? [];
      state.filters.forEach((row) => {
        switch (row.dataType) {
          case "number":
            const val = Number(row.value);
            switch (row.type) {
              case "greater":
                filteredData = filteredData.filter(
                  (data) => Number(data[row.header]) > val
                );
                break;
              case "lesser":
                filteredData = filteredData.filter(
                  (data) => Number(data[row.header]) < val
                );
                break;
              case "equal":
                filteredData = filteredData.filter(
                  (data) => data[row.header] === val
                );
                break;
              case "notEqual":
                filteredData = filteredData.filter(
                  (data) => data[row.header] !== val
                );
                break;
            }
            break;
          case "string":
            switch (row.type) {
              case "equal":
                filteredData = filteredData.filter(
                  (data) => data[row.header] === row.value
                );
                break;
              case "notEqual":
                filteredData = filteredData.filter(
                  (data) => data[row.header] !== row.value
                );
                break;
              case "contains":
                filteredData = filteredData.filter((data) =>
                  (data[row.header] as string).includes(row.value)
                );
                break;
              case "notContains":
                filteredData = filteredData.filter(
                  (data) => !(data[row.header] as string).includes(row.value)
                );
                break;
              case "startsWith":
                filteredData = filteredData.filter((data) =>
                  (data[row.header] as string).startsWith(row.value)
                );
                break;
              case "endsWith":
                filteredData = filteredData.filter((data) =>
                  (data[row.header] as string).endsWith(row.value)
                );
                break;
            }
            break;
        }
      });
      state.filteredData = {
        headers: state.data?.headers ?? [],
        rows: filteredData,
      };
    },
    resetFilters: (state) => {
      state.filters = [];
      state.filteredData = state.data;
    },
  },
});

export const {
  addFileData,
  addFilter,
  setFilterType,
  setFilterHeader,
  setFilterValue,
  removeFilter,
  applyFilters,
  resetFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;
