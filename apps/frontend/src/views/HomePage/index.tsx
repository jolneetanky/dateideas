"use client";
import { DateLocationList } from "@/features/dateidea/components";
import { InputBar } from "@/features/generator/components";
import {
  useFetchDateIdea,
  // useFetchGeneratedIdeasPage,
  useInputBar,
} from "@/features/generator/hooks";
import {
  selectGeneratedIdeasStatus,
  selectJobId,
} from "@/features/generator/slice";
import { LoadMore } from "@/features/pagination/components";
import {
  nextCursorChanged,
  selectNextCursor,
} from "@/features/pagination/slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

// TODO: convert to CSS module
const HomePageStyle = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100%",
  },
  dateIdeaListWrapper: {
    height: "65%",
  },
  inputBarWrapper: {
    height: "25%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pageNavWrapper: {
    bottom: "1rem",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
};

export default function HomePage() {
  const jobId = useAppSelector(selectJobId);
  // const page = useAppSelector(selectGeneratedIdeasPageNumber);
  const status = useAppSelector(selectGeneratedIdeasStatus);
  const cursor = useAppSelector(selectNextCursor);

  const {
    inputValue,
    handleChange,
    handleSubmit,
    isPending: generationLoading,
    error: generationError,
  } = useInputBar();

  const {
    data: dateIdea,
    loading: dateIdeaLoading,
    error: dateIdeaError,
  } = useFetchDateIdea(jobId, cursor);
  const description = dateIdea?.description;
  const locations = dateIdea?.dateLocations;

  const dispatch = useAppDispatch();
  const handleLoadMore = () => {
    console.log("LOAD MORE");
    dispatch(nextCursorChanged(cursor));
  };

  return (
    <div style={HomePageStyle.container} className="flex-col">
      <div style={HomePageStyle.inputBarWrapper}>
        <InputBar
          inputValue={inputValue}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>

      <div style={HomePageStyle.dateIdeaListWrapper}>
        {(generationLoading || dateIdeaLoading) && <>Generating...</>}

        {!generationLoading &&
          !dateIdeaLoading &&
          generationError == "" &&
          dateIdeaError == "" && (
            <>
              {description}
              <DateLocationList locations={locations ?? []} />
            </>
          )}

        {generationError != "" && <>{generationError}</>}

        {dateIdeaError != "" && <>{dateIdeaError}</>}
      </div>

      {status == "success" && <LoadMore onClick={handleLoadMore} />}
    </div>
  );
}
