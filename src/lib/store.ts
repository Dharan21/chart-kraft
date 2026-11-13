import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./features/appSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appSlice,
    },
    // CSV datasets are large; the dev-only deep immutability/serializable
    // scans of every row on every action make the UI crawl.
    middleware: (getDefault) =>
      getDefault({ immutableCheck: false, serializableCheck: false }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
