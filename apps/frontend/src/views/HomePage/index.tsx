"use client";
import {
  DateDescription,
  DateLocationList,
} from "@/features/dateidea/components";
import { InputBar } from "@/features/generator/components";
import {
  useFetchDateIdea,
  // useFetchGeneratedIdeasPage,
  useInputBar,
} from "@/features/generator/hooks";
import { selectJobId } from "@/features/generator/slice";
import { LoadMore, LoadPrev } from "@/features/pagination/components";
import {
  curCursorChanged,
  directionChanged,
  selectCurCursor,
  selectDirection,
  selectNextCursor,
  selectPrevCursor,
} from "@/features/pagination/slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

// TODO: convert to CSS module
const HomePageStyle = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100%",
    padding: "1rem",
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
    marginTop: "auto",
    paddingTop: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
};

export default function HomePage() {
  const jobId = useAppSelector(selectJobId);
  const nextCursor = useAppSelector(selectNextCursor);
  const curCursor = useAppSelector(selectCurCursor);
  const prevCursor = useAppSelector(selectPrevCursor);
  const direction = useAppSelector(selectDirection);
  const LIMIT = 5;

  const {
    inputValue,
    locationVal,
    handleChange,
    handleSubmit,
    handleLocationChange,
    isPending: generationLoading,
    error: generationError,
  } = useInputBar();

  const {
    data: dateIdea,
    loading: dateIdeaLoading,
    error: dateIdeaError,
  } = useFetchDateIdea(jobId, curCursor, LIMIT, direction);
  const description = dateIdea?.description;
  const locations = dateIdea?.dateLocations;

  const dispatch = useAppDispatch();

  const handleLoadMore = () => {
    console.log("LOAD MORE");
    if (nextCursor != null) {
      dispatch(curCursorChanged(nextCursor));
      dispatch(directionChanged("next"));
    }
  };

  const handleLoadPrev = () => {
    console.log("LOAD PREV");
    if (prevCursor != null) {
      dispatch(curCursorChanged(prevCursor));
      dispatch(directionChanged("prev"));
    }
  };

  const hasNext = () => {
    return (
      !generationLoading &&
      !dateIdeaLoading &&
      (locations == undefined || locations.length == LIMIT)
    );
  };

  const hasPrev = () => {
    return (
      !generationLoading &&
      !dateIdeaLoading &&
      prevCursor != undefined &&
      prevCursor != null &&
      curCursor != "0"
    );
  };

  return (
    <div style={HomePageStyle.container} className="flex-col">
      <div style={HomePageStyle.inputBarWrapper}>
        <InputBar
          inputValue={inputValue}
          locationVal={locationVal}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleLocationChange={handleLocationChange}
        />
      </div>

      <div style={HomePageStyle.dateIdeaListWrapper}>
        {(generationLoading || dateIdeaLoading) && <>Generating...</>}

        {description && <DateDescription description={description} />}

        <DateLocationList locations={locations ?? []} />

        {generationError != "" && <>{generationError}</>}

        {dateIdeaError != "" && <>{dateIdeaError}</>}
      </div>

      <div style={HomePageStyle.pageNavWrapper}>
        {hasPrev() && <LoadPrev onClick={handleLoadPrev} />}
        {hasNext() && <LoadMore onClick={handleLoadMore} />}
      </div>
    </div>
  );
}
