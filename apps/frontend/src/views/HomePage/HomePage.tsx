"use client";
import { DateIdeaList } from "@/features/dateidea/components";
import { GeneratorInput } from "@/features/dateidea/components";
import { useFetch, usePaginatedFetch } from "@/features/dateidea/hooks";
import { useState } from "react";

export default function HomePage() {
  const page = useState(1);
  const limit = 10;
  // TODO: refactor to `usePaginatedFetch`
  const { data: dateIdeaPage, error, loading } = usePaginatedFetch(2, 1);
  const dateideas = dateIdeaPage?.data;

  return (
    <div className="px-[2%] h-full flex flex-col items-center">
      <div className="h-[20%] flex items-center justify-center">
        <GeneratorInput />
      </div>
      <div className="h-[80%] flex items-center justify-center">
        <DateIdeaList dateideas={dateideas ?? []} />
        <>{error}</>
      </div>
    </div>
  );
}
