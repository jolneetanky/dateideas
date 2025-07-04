import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/store";
import { DateIdea } from "../dateidea/types";

// STATE INTERFACE
interface GeneratedIdeasState {
  jobId: string;
  status: "idle" | "success" | "error" | "loading";
}

// INITIAL STATE
const initialState: GeneratedIdeasState = {
  jobId: "",
  status: "idle",
};

// SLICE. REDUCERS (state, action) => newState DEFINED HERE.
const generatorSlice = createSlice({
  name: "generator",
  initialState,
  reducers: {
    jobIdChanged(state, action: PayloadAction<string>) {
      state.jobId = action.payload;
    },
    generatedIdeasStatusChanged(
      state,
      action: PayloadAction<"idle" | "success" | "error" | "loading">
    ) {
      state.status = action.payload;
    },
  },
});

// Export ACTION CREATORS
export const { jobIdChanged, generatedIdeasStatusChanged } =
  generatorSlice.actions;
// Export REDUCERS
export const generatorReducer = generatorSlice.reducer;
// Export SELECTORS
export const selectJobId = (state: RootState) => state.generator.jobId;
export const selectGeneratedIdeasStatus = (state: RootState) =>
  state.generator.status;
