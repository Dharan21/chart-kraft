import { configureStore } from "@reduxjs/toolkit";
import tabsSlice from "./features/tabs/tabsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      tabs: tabsSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
