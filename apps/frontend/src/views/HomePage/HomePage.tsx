"use client";
import { PageNav } from "@/features/pagination/components";
import { DateIdeaList } from "@/features/dateidea/components";
import { GeneratorInput } from "@/features/dateidea/components";
import { useFetch, usePaginatedFetch } from "@/features/dateidea/hooks";
import { useState } from "react";

export default function HomePage() {
  const [page, setPage] = useState(1);

  const { data: dateIdeaPage, error, loading } = usePaginatedFetch(page, 1);
  const dateideas = dateIdeaPage?.data;
  const totalPages = dateIdeaPage?.totalPages ?? 0;

  return (
    <div className="relative px-[2%] h-full flex flex-col items-center">
      <div className="h-[20%] flex items-center justify-center">
        <GeneratorInput />
      </div>
      <div className="h-[80%]">
        {error ? <>{error}</> : <DateIdeaList dateideas={dateideas ?? []} />}
      </div>

      {/* Sticky Footer Navigation */}
      <div className="fixed bottom-[2%] m-auto">
        {/* <PageNav totalPages={totalPages} pagination={pagination} /> */}
        <PageNav totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  );
}
