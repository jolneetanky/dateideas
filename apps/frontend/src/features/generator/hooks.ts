import { initLogger } from "@/lib/logger";
import React, { useState } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  generatedIdeasPageNumberChanged,
  generatedIdeasStatusChanged,
  jobIdChanged,
} from "./slice";
import { UseFetchResponse } from "@/common/types/hooks";
import { Paginated } from "../pagination/types";
import { DateIdea } from "../dateidea/types";
import generatorClient from "./api-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useInputBar = () => {
  const log = initLogger("[generator.hooks.useInputBar]");

  const [inputValue, setInputValue] = useState("");

  // dispatch
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // MUTATE
  const {
    mutate: generateIdeas,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: async () => {
      const {
        type,
        data: jobId,
        error,
      } = await generatorClient.generate(inputValue);

      if (type === "error" || !jobId) {
        throw new Error(error); // i think this causes `isError` to be true?
      }
      return jobId;
    },
    onSuccess: (jobId) => {
      dispatch(generatedIdeasPageNumberChanged(1));
      dispatch(jobIdChanged(jobId));
      dispatch(generatedIdeasStatusChanged("success"));
      log.info(`Successfully generated date ideas, jobID: ${jobId}`);
    },
    onError: (err) => {
      dispatch(generatedIdeasStatusChanged("error"));
      log.error(`Failed to generate date ideas, error: ${err}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    log.info(
      `[generator.hooks.useInputBar.handleSubmit] Generating... ${inputValue}`
    );

    generateIdeas();
  };

  return {
    inputValue,
    handleChange,
    handleSubmit,
    isPending,
    isError,
    isSuccess,
    error: error?.message ?? "",
  };
};

export const useFetchGeneratedIdeasPage = (
  page: number,
  jobId: string
): UseFetchResponse<Paginated<DateIdea>> => {
  const log = initLogger("[useFetchGeneratedIdeasPage");

  log.info(`Fetching page ${page} for job ID ${jobId}`);

  const { data: generatorClientResponse, isLoading: loading } = useQuery({
    queryKey: [page, jobId],
    queryFn: async () => await generatorClient.getPage(jobId, page),
  });

  return {
    data: generatorClientResponse?.data ?? null,
    loading,
    error: generatorClientResponse?.error ?? "",
  };
};
