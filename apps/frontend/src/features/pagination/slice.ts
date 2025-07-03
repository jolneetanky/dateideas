import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/store";

// STATE INTERFACE
interface PaginationState {
  curCursor: string;
  nextCursor: string;
}

// INITIAL STATE
const initialState: PaginationState = {
  curCursor: "0",
  nextCursor: "0",
};

// SLICE. REDUCERS (state, action) => newState DEFINED HERE.
const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    nextCursorChanged(state, action: PayloadAction<string>) {
      state.nextCursor = action.payload;
    },
    curCursorChanged(state, action: PayloadAction<string>) {
      state.curCursor = action.payload;
    },
  },
});

// Export ACTION CREATORS
export const { nextCursorChanged, curCursorChanged } = paginationSlice.actions;
// Export REDUCERS
export const paginationReducer = paginationSlice.reducer;
// Export SELECTORS
export const selectNextCursor = (state: RootState) =>
  state.pagination.nextCursor;
export const selectCurCursor = (state: RootState) => state.pagination.curCursor;
