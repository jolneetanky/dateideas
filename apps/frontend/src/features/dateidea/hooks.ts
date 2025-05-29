import { Dispatch, SetStateAction } from "react";
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
// returns the page data, error, and loading states.
// fetch based on jobId.
const usePaginatedFetch = (page: number, pageSize: number, jobId: string): UseFetchResponse<Paginated<DateIdea>> => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['dateideas', page, pageSize, jobId], // REACT QUERY REFETCHES WHEN ANY OF THESE CHANGE!!
    queryFn: () => dateIdeaClient.getPage(page, pageSize),
  })

  let res;
  if (!data || jobId === "" || data?.data === null || data?.data === undefined) {
    res = null;
  } else {
    res = data.data;
  }

  return {
    data: res,
    error: error?.message ?? "",
    loading: isPending,
  }
}

// simply sends the job, and returns the jobIDi.
const useGenerate = (setPage: Dispatch<SetStateAction<number>>) => {
  // send the job ID
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    // generate and set page back to 1.
    setJobId("JOBID1");
    setPage(1);
  }

  return {
    handleGenerate,
    error: error,
    loading: loading,
    jobId: jobId, 
  }
}

// tells us the status of the job.
// listens to BE to tell us when job is done.
// if jobId == null, ie. there's no job currently,
// then done = true, loading = false, error = "".
const useJobStatus = (jobId: string | null) => {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // if jobId changes, 
  // means a new job has been generated and we are to wait for that job.
  useEffect(() => {
    if (!jobId) return;

    // either keep polling, or await some notification
    setDone(true);
  }, [jobId]);

  return {
    done,
    loading,
    error,
  }
}

export {
  useFetch,
  usePaginatedFetch,
  useGenerate,
  useJobStatus,
}

