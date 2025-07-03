import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/store";

// STATE INTERFACE
interface PaginationState {
  nextCursor: string;
}

// INITIAL STATE
const initialState: PaginationState = {
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
  },
});

// Export ACTION CREATORS
export const { nextCursorChanged } = paginationSlice.actions;
// Export REDUCERS
export const paginationReducer = paginationSlice.reducer;
// Export SELECTORS
export const selectNextCursor = (state: RootState) =>
  state.pagination.nextCursor;
