import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/store";

// STATE INTERFACE
interface PaginationState {
  curCursor: string;
  nextCursor: string | null;
  prevCursor: string | null;
  direction: "prev" | "next";
}

// INITIAL STATE
const initialState: PaginationState = {
  curCursor: "0",
  nextCursor: null,
  prevCursor: null,
  direction: "next",
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
    prevCursorChanged(state, action: PayloadAction<string>) {
      state.prevCursor = action.payload;
    },
    directionChanged(state, action: PayloadAction<"prev" | "next">) {
      state.direction = action.payload;
    },
  },
});

// Export ACTION CREATORS
export const {
  nextCursorChanged,
  curCursorChanged,
  prevCursorChanged,
  directionChanged,
} = paginationSlice.actions;
// Export REDUCERS
export const paginationReducer = paginationSlice.reducer;
// Export SELECTORS
export const selectNextCursor = (state: RootState) =>
  state.pagination.nextCursor;
export const selectCurCursor = (state: RootState) => state.pagination.curCursor;
export const selectPrevCursor = (state: RootState) =>
  state.pagination.prevCursor;
export const selectDirection = (state: RootState) => state.pagination.direction;
