"use client";
import { PageNav } from "@/features/pagination/components";
import { DateIdeaList } from "@/features/dateidea/components";
import { GeneratorInput } from "@/features/dateidea/components";
import {
  useFetch,
  useGenerate,
  usePaginatedFetch,
  useJobStatus,
} from "@/features/dateidea/hooks";
import { useState } from "react";

export default function HomePage() {
  // 1) IF THERE'S NO JOB: `jobId` == null
  // 2) IF THERE'S A PENDING JOB: `jobId` != null && !done
  // 3) IF THERE'S A COMPLETED JOB: `jobId` != null && done
  const [page, setPage] = useState(1);

  const {
    handleGenerate,
    error: sendError,
    loading: sending,
    jobId,
  } = useGenerate(setPage);

  // if no job ie. jobId == null,
  // done = true, loading = false, error = "".
  const {
    done,
    loading: generating,
    error: generationError,
  } = useJobStatus(jobId);

  const {
    data: dateIdeaPage,
    error,
    loading,
  } = usePaginatedFetch(page, 1, jobId ?? "");

  const dateideas = dateIdeaPage?.data ?? null;
  const totalPages = dateIdeaPage?.totalPages ?? 0;

  return (
    <div className="relative px-[2%] h-full flex flex-col items-center">
      <div className="h-[20%] flex items-center justify-center">
        <GeneratorInput handleGenerate={handleGenerate} />
      </div>
      <div className="h-[80%]">
        {!done && jobId ? (
          <>Generating...</>
        ) : (
          <DateIdeaList dateideas={dateideas ?? []} />
        )}
      </div>

      {/* Sticky Footer Navigation */}
      <div className="fixed bottom-[2%] m-auto">
        <PageNav totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  );
}
