import { initLogger } from "@/lib/logger";
import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { generatedIdeasStatusChanged, jobIdChanged } from "./slice";
import { nextCursorChanged, prevCursorChanged } from "../pagination/slice";
import { UseFetchResponse } from "@/common/types/hooks";
import { DateIdea } from "../dateidea/types";
import generatorClient from "./api-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useInputBar = () => {
  const log = initLogger("[generator.hooks.useInputBar]");

  const [inputValue, setInputValue] = useState("");

  const [locationVal, setLocationVal] = useState<string | null>(null);
  const handleLocationChange = (val: string | null) => {
    console.log(`[useInputBar.handleLocatinoChange()]: VAL: ${val}`);
    setLocationVal(val);
  };

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
        status,
        data: jobId,
        error,
      } = await generatorClient.generate(inputValue, locationVal);

      if (status === "error" || !jobId) {
        throw new Error(error); // i think this causes `isError` to be true?
      }
      return jobId;
    },
    onSuccess: (jobId) => {
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
    locationVal,
    handleChange,
    handleSubmit,
    handleLocationChange,
    isPending,
    isError,
    isSuccess,
    error: error?.message ?? "",
  };
};

export const useFetchDateIdea = (
  jobId: string,
  cursor: string,
  limit: number,
  direction: "next" | "prev"
): UseFetchResponse<DateIdea> => {
  console.log(
    `[generator.hooks.useFetchDateIdea()] Fetching date ideas for job ID ${jobId}. Cursor: ${cursor}, Limit: ${limit}. Direction: ${direction}`
  );
  console.log("[useFetchDateIdea]");

  const dispatch = useAppDispatch();

  // will only be called again if `jobId` changes
  const { data: generatorClientResponse, isLoading: loading } = useQuery({
    queryKey: [jobId, cursor, limit, direction],
    queryFn: async () =>
      await generatorClient.getResult(jobId, cursor, limit, direction),
    enabled: jobId != "",
  });

  const dateidea = generatorClientResponse?.data?.data;
  const nextCursor = generatorClientResponse?.data?.nextCursor;
  const prevCursor = generatorClientResponse?.data?.prevCursor;
  // const curCursor = generatorClientResponse?.data?.prevCursor;

  // TODO: store the next cursor and prev cursor
  useEffect(() => {
    if (nextCursor != undefined) {
      dispatch(nextCursorChanged(nextCursor));
    }

    if (prevCursor != undefined) {
      dispatch(prevCursorChanged(prevCursor));
    }
  }, [generatorClientResponse, dispatch, nextCursor]);

  return {
    data: dateidea ?? null,
    loading,
    error: generatorClientResponse?.error ?? "",
  };
};
