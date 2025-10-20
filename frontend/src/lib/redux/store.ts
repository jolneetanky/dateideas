import { generatorReducer } from "@/features/generator/slice";
import { paginationReducer } from "@/features/pagination/slice";
import { configureStore } from "@reduxjs/toolkit";

// reducers

export const makeStore = () => {
  return configureStore({
    reducer: {
      generator: generatorReducer,
      pagination: paginationReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
