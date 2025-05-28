import { UseFetchResponse } from "@/common/types/hooks";
import { useEffect, useState } from "react";
import { DateIdea } from "./types";
import { dateideas } from "./mock-data";
import { Paginated } from "../pagination/types";
import dateIdeaClient from "./api-client";
import { useQuery } from "@tanstack/react-query";

// This function helps us fetch DateIdeas.
const useFetch = (): UseFetchResponse<DateIdea[]> => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)

  return {
      data: dateideas,
      error: error,
      loading: loading,
  }
}

// helps us fetch a page.
const usePaginatedFetch = (page: number, pageSize: number): UseFetchResponse<Paginated<DateIdea>> => {
  let { isPending, isError, data, error } = useQuery({
    queryKey: ['dateideas', page, pageSize], // REACT QUERY REFETCHES WHEN ANY OF THESE CHANGE!!
    queryFn: () => dateIdeaClient.getPage(page, pageSize),
  })

  return {
    data: data?.data ?? null,
    error: error?.message ?? "",
    loading: isPending,
  }
}

export {
  useFetch,
  usePaginatedFetch,
}