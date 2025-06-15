import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DateIdea } from "../dateidea/types";
import { Paginated } from "../pagination/types";
import generatorClient from "./api-client";
import { RootState } from "@/lib/redux/store";
import { initLogger } from "@/lib/logger";

// STATE INTERFACE
interface GeneratedIdeasState {
  generatedIdeasPage: Paginated<DateIdea>;
  // pageNumber: number;
  status: "idle" | "success" | "error" | "loading";
}

// INITIAL STATE
const initialState: GeneratedIdeasState = {
  generatedIdeasPage: {
    pageNumber: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
    data: [],
  },
  // pageNumber: 0,
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
    console.log("[generator.slice.generateDateIdeas]", prompt, jobId);
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
    // Argument typess
    page: number;
    jobId: string;
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
      jobId,
    }: {
      page: number;
      jobId: string;
    },
    { getState, rejectWithValue }
  ) => {
    const log = initLogger("[generator.slice.getGeneratedIdeasPage]");
    log.info(`Fetching page ${page} for job ID ${jobId}`);
    console.log("[generator.slice.getGeneratedIdeasPage]", page);
    const state = getState() as RootState; // Gets the entire Redux state
    // const jobId = state.generator.jobId;
    const curPage = state.generator.generatedIdeasPage.pageNumber;
    console.log("[generator.slice.getGeneratedIdeasPage]", curPage, jobId);

    // no need to refetch if curpage alr this.
    if (curPage == page) {
      return state.generator.generatedIdeasPage;
    }

    const {
      type,
      data: dateIdeasPage,
      error,
    } = await generatorClient.getPage(jobId, page);
    console.log("[generator.slice.getGeneratedIdeasPage] PAGE", dateIdeasPage);
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
    // generatedIdeasPageChanged(state, action: PayloadAction<number>) {
    //   state.pageNumber = action.payload;
    // },
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
// Export REDUCERS
export const generatorReducer = generatorSlice.reducer;
// Export SELECTORS
export const selectGeneratedIdeasPage = (state: RootState) =>
  state.generator.generatedIdeasPage;
