"use client";
import { DateIdeaList } from "@/features/dateidea/components";
import {
  GeneratedIdeasPageNav,
  InputBar,
} from "@/features/generator/components";
import {
  useGeneratedIdeasPageCtx,
  useJobIdCtx,
} from "@/features/generator/contexts";
import { useFetchGeneratedIdeasPage } from "@/features/generator/hooks";

// TODO: convert to CSS module
const HomePageStyle = {
  container: {
    display: "flex",
    // flexDirection: "column" as "column", // placed here so ts doesn't scream
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
    // position: "fixed" as "fixed", // placed here so ts doesn't scream
    bottom: "1rem",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
};

export default function HomePage() {
  // const page = useAppSelector(selectGeneratedIdeasPageNumber);
  const { page } = useGeneratedIdeasPageCtx();
  const { jobId } = useJobIdCtx();
  // const generatedIdeasPage = useAppSelector(selectGeneratedIdeasPage);
  // Within the `useFetchGeneratedIdeasPage` hook, there's a `useEffect` that will run when `page` changes
  // ensuring that `data`, `loading`, `error` changes when `page` changes.
  const {
    data: generatedIdeasPage,
    loading,
    // error,
  } = useFetchGeneratedIdeasPage(page, jobId);
  const dateideas = generatedIdeasPage?.data;

  return (
    <div style={HomePageStyle.container} className="flex-col">
      <div style={HomePageStyle.inputBarWrapper}>
        <InputBar />
      </div>

      <div style={HomePageStyle.dateIdeaListWrapper}>
        {loading ? <>Loading</> : <DateIdeaList dateideas={dateideas ?? []} />}
      </div>

      <div style={HomePageStyle.pageNavWrapper} className="fixed">
        {dateideas?.length == 0 ? <></> : <GeneratedIdeasPageNav />}
      </div>
    </div>
  );
}
