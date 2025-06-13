"use client";
import { DateIdeaList } from "@/features/dateidea/components";
import {
  GeneratedIdeasPageNav,
  InputBar,
} from "@/features/generator/components";
import { useFetchGeneratedIdeasPage } from "@/features/generator/hooks";
import {
  selectGeneratedIdeasPage,
  selectGeneratedIdeasPageNumber,
} from "@/features/generator/slice";
import { PageNav } from "@/features/pagination/components";
import { useAppSelector } from "@/lib/redux/hooks";

// TODO: convert to CSS module
const HomePageStyle = {
  container: {
    display: "flex",
    // flexDirection: "column",
    height: "100vh",
    width: "100%",
  },
  inputBarWrapper: {
    height: "35%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default function HomePage() {
  // NEED: page
  const page = useAppSelector(selectGeneratedIdeasPageNumber);
  // const generatedIdeasPage = useAppSelector(selectGeneratedIdeasPage);
  const {
    data: generatedIdeasPage,
    loading,
    error,
  } = useFetchGeneratedIdeasPage(page);
  const dateideas = generatedIdeasPage?.data;

  return (
    <div style={HomePageStyle.container} className="flex-col">
      <div style={HomePageStyle.inputBarWrapper}>
        <InputBar />
      </div>
      <div>
        <DateIdeaList dateideas={dateideas ?? []} />
        <GeneratedIdeasPageNav />
      </div>
    </div>
  );
}
