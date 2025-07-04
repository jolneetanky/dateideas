import { initLogger } from "@/lib/logger";
import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { generatedIdeasStatusChanged, jobIdChanged } from "./slice";
import { nextCursorChanged } from "../pagination/slice";
import { UseFetchResponse } from "@/common/types/hooks";
import { DateIdea } from "../dateidea/types";
import generatorClient from "./api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import next from "next";

export const useInputBar = () => {
  const log = initLogger("[generator.hooks.useInputBar]");

  const [inputValue, setInputValue] = useState("");

  const [locationVal, setLocationVal] = useState<string | null>("");
  const handleLocationChange = (val: string | null) => {
    console.log(`[useInputBar.handleLocatinoChange()]: VAL: ${val}`);
    setLocationVal(val);
  };

  // const location = useLocationContext()

  // dispatch
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // TODO: handle location here
  // maybe can use some context

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
  after?: string,
  limit?: number
): UseFetchResponse<DateIdea> => {
  const log = initLogger("[useFetchDateIdea");
  console.log(
    `[generator.hooks.useFetchDateIdea()] Fetching date ideas for job ID ${jobId}. After: ${after}, Limit: ${limit}`
  );
  console.log("[useFetchDateIdea]");

  const dispatch = useAppDispatch();

  // will only be called again if `jobId` changes
  const { data: generatorClientResponse, isLoading: loading } = useQuery({
    queryKey: [jobId, after, limit],
    queryFn: async () => await generatorClient.getResult(jobId, after, limit),
    enabled: jobId != "",
  });

  const dateidea = generatorClientResponse?.data?.data;
  const nextCursor = generatorClientResponse?.data?.nextCursor;

  // TODO: store the next cursor
  useEffect(() => {
    if (nextCursor != undefined) {
      dispatch(nextCursorChanged(nextCursor));
    }
  }, [generatorClientResponse]);

  return {
    data: dateidea ?? null,
    loading,
    error: generatorClientResponse?.error ?? "",
  };
};
