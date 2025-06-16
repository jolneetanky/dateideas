"use client";
import { DateIdeaList } from "@/features/dateidea/components";
import {
  GeneratedIdeasPageNav,
  InputBar,
} from "@/features/generator/components";
import {
  useFetchGeneratedIdeasPage,
  useInputBar,
} from "@/features/generator/hooks";
import {
  selectGeneratedIdeasPageNumber,
  selectGeneratedIdeasStatus,
  selectJobId,
} from "@/features/generator/slice";
import { useAppSelector } from "@/lib/redux/hooks";

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
  // const { page } = useGeneratedIdeasPageCtx();
  const jobId = useAppSelector(selectJobId);
  const page = useAppSelector(selectGeneratedIdeasPageNumber);
  const status = useAppSelector(selectGeneratedIdeasStatus);
  // const generatedIdeasPage = useAppSelector(selectGeneratedIdeasPage);
  // Within the `useFetchGeneratedIdeasPage` hook, there's a `useEffect` that will run when `page` changes
  // ensuring that `data`, `loading`, `error` changes when `page` changes.
  const {
    inputValue,
    handleChange,
    handleSubmit,
    isPending: generationLoading,
    error: _generationError,
  } = useInputBar();

  const {
    data: generatedIdeasPage,
    loading: _loading,
    error: _error,
  } = useFetchGeneratedIdeasPage(page, jobId);
  const dateideas = generatedIdeasPage?.data;

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
        {generationLoading ? (
          <>Generating...</>
        ) : (
          <DateIdeaList dateideas={dateideas ?? []} />
        )}
      </div>

      <div style={HomePageStyle.pageNavWrapper} className="fixed">
        {dateideas?.length == 0 || status == "idle" ? (
          <></>
        ) : (
          <GeneratedIdeasPageNav />
        )}
      </div>
    </div>
  );
}
