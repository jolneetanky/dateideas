import { UseFetchResponse } from "@/common/types/hooks";
import { useEffect, useState } from "react";
import { DateIdea } from "./types";
import { dateideas } from "./mock-data";
import { Pagination } from "../pagination/types";
import dateIdeaClient from "./api-client";

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
const usePaginatedFetch = (page: number, pageSize: number): UseFetchResponse<Pagination<DateIdea>> => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Pagination<DateIdea> | null>(null);

  const getPage = async () => {
    try {
      setLoading(true);
      const { type, data, error } = await dateIdeaClient.getPage(page, pageSize);
      setData(data);
      setError(error);
    } catch (err) {
      console.log("[features/dateidea/hooks.usePaginatedFetch] ERROR FETCHING DATA", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPage();
  })

  return {
    data: data,
    error: error,
    loading: loading,
  }
}

export {
  useFetch,
  usePaginatedFetch,
}