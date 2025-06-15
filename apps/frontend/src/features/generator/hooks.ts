import { initLogger } from "@/lib/logger";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  generateDateIdeas,
  generatedIdeasPageNumberChanged,
  getGeneratedIdeasPage,
  jobIdChanged,
} from "./slice";
import { UseFetchResponse } from "@/common/types/hooks";
import { Paginated } from "../pagination/types";
import { DateIdea } from "../dateidea/types";
// import { useQuery } from "@tanstack/react-query";
// import generatorClient from "./api-client";

export const useInputBar = () => {
  const log = initLogger("[generator.hooks.useInputBar]");

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const {
  //   data: jobId,
  //   isLoading: loading,
  //   error,
  // } = useQuery({
  //   queryKey: ["generatedIdeas"],
  //   queryFn: async () => {
  //     const res = await generatorClient.generate(inputValue);
  //     return res.data;
  //   },
  // });

  // dispatch
  const dispatch = useAppDispatch();

  // HANDLERS
  const resetForm = () => {
    setInputValue("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    log.info(
      `[generator.hooks.useInputBar.handleSubmit] Generating... ${inputValue}`
    );

    // REDUX IMPL
    const generateIdeas = async () => {
      setLoading(true);
      const prompt = inputValue;

      // try generating. If it fails, simply return
      try {
        // unwrapping it returns a NEW Promise
        // with either the `action.payload` value from a `fulfilled` action
        // or throw an error if it's the `rejected` action.

        // TODO: replace with useQuery. Or just use our client directly.
        const jobId = await dispatch(
          generateDateIdeas({ prompt: prompt })
        ).unwrap();
        // set `page` and `jobId` context so our `HomePage` can use it to call the `useFetchGeneratedIdeasPage` hook
        // changePage(1);
        dispatch(generatedIdeasPageNumberChanged(1));
        dispatch(jobIdChanged(jobId));
        // changeJobId(jobId);
      } catch (err) {
        setError(err as string);
        setLoading(false);
        resetForm();
        return;
      } finally {
        setLoading(false);
        resetForm();
      }
    };

    generateIdeas();
  };

  return { inputValue, handleChange, handleSubmit, loading, error };
};

export const useFetchGeneratedIdeasPage = (
  page: number,
  jobId: string
): UseFetchResponse<Paginated<DateIdea>> => {
  const log = initLogger("[useFetchGeneratedIdeasPage");

  const [data, setData] = useState<Paginated<DateIdea> | null>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  log.info(`Fetching page ${page} for job ID ${jobId}`);

  // DISPATCH
  const dispatch = useAppDispatch();

  // `useCallback` makes it s.t. `fetchPage` changes when `page` or `dispatch` changes
  const fetchPage = useCallback(async () => {
    setLoading(true);

    try {
      const res = await dispatch(
        getGeneratedIdeasPage({ page: page, jobId: jobId })
      ).unwrap();
      setData(res);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  }, [page, jobId, dispatch]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  return {
    data: data as Paginated<DateIdea> | null,
    loading,
    error,
  };
};
