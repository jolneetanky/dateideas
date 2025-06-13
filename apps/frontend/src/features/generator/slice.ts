import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateIdea } from "../dateidea/types";
import { Paginated } from "../pagination/types";
import generatorClient from "./api-client";
import { RootState } from "@/lib/redux/store";

// STATE INTERFACE
interface GeneratedIdeasState {
  jobId: string; // current jobID we're displaying
  generatedIdeasPage: Paginated<DateIdea>;
  pageNumber: number;
  status: "idle" | "success" | "error" | "loading";
}

// INITIAL STATE
const initialState: GeneratedIdeasState = {
  jobId: "",
  generatedIdeasPage: {
    pageNumber: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
    data: [],
  },
  pageNumber: 0,
  status: "idle",
};

// THUNKS FOR ASYNC LOGIC
// thunk to set state of jobId
export const generateDateIdeas = createAsyncThunk<
  string, // Payload type of `fulfilled` action
  {
    prompt: string;
  }, // Argument types
  { rejectValue: string }
>(
  "generator/generateDateIdeas",
  // PAYLOAD CREATOR (ie. the thunk)
  async (
    {
      prompt,
    }: {
      prompt: string;
    },
    { rejectWithValue }
  ) => {
    const { type, data: jobId, error } = await generatorClient.generate(prompt);
    if (type === "success") {
      return jobId as string;
    } else {
      return rejectWithValue(error);
    }
  }
);

// get page using current job ID
// thunk action creator
export const getGeneratedIdeasPage = createAsyncThunk<
  Paginated<DateIdea>, // Payload type of `fulfilled` action,
  {
    page: number;
  },
  {
    rejectValue: string;
  }
>(
  "generator/getGeneratedIdeasPage",
  // PAYLOAD CREATOR (Ie. the thunk)
  async (
    {
      page,
    }: {
      page: number;
    },
    { getState, rejectWithValue }
  ) => {
    const state: RootState = getState(); // Gets the entire Redux state
    const jobId = state.generator.jobId;
    const curPage = state.generator.page;

    // If no page change, no need for API call
    if (curPage == page) {
      return state.generator.generatedIdeasPage;
    }

    const {
      type,
      data: dateIdeasPage,
      error,
    } = await generatorClient.getPage(jobId, page);
    if (type === "success") {
      return dateIdeasPage as Paginated<DateIdea>;
    } else {
      return rejectWithValue(error);
    }
  }
);

// SLICE. REDUCERS (state, action) => newState DEFINED HERE.
const generatorSlice = createSlice({
  name: "generator",
  initialState,
  reducers: {
    // generates ACTION CREATORS with the corresponding names
    generatedIdeasPageChanged(state, action: PayloadAction<number>) {
      state.pageNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // LISTEN FOR GENERATE DATE IDEAS
      .addCase(generateDateIdeas.pending, (state) => {
        state.status = "loading";
      })
      .addCase(generateDateIdeas.fulfilled, (state, action) => {
        const jobId = action.payload;
        state.status = "success";
        state.jobId = jobId;
      })
      .addCase(generateDateIdeas.rejected, (state) => {
        state.status = "error";
      })
      // LISTEN FOR PAGE CHANGE
      .addCase(getGeneratedIdeasPage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getGeneratedIdeasPage.fulfilled, (state, action) => {
        const dateIdeasPage = action.payload;
        state.status = "success";
        state.generatedIdeasPage = dateIdeasPage;
      })
      .addCase(getGeneratedIdeasPage.rejected, (state) => {
        state.status = "error";
      });
  },
});

// Export ACTION CREATORS
export const { generatedIdeasPageChanged } = generatorSlice.actions;
// Export REDUCERS
export const generatorReducer = generatorSlice.reducer;
// Export SELECTORS
export const selectJobId = (state: RootState) => state.generator.jobId;
export const selectGeneratedIdeasPage = (state: RootState) =>
  state.generator.generatedIdeasPage;
export const selectGeneratedIdeasPageNumber = (state: RootState) =>
  state.generator.pageNumber;
