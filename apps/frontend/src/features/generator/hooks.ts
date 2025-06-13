import { initLogger } from "@/lib/logger";
import React, { useEffect, useState } from "react";
import generatorClient from "./api-client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  generateDateIdeas,
  generatedIdeasPageChanged,
  getGeneratedIdeasPage,
  selectGeneratedIdeasPage,
} from "./slice";
import { UseFetchResponse } from "@/common/types/hooks";
import { Paginated } from "../pagination/types";
import { DateIdea } from "../dateidea/types";

export const useInputBar = () => {
  const log = initLogger("[generator.hooks.useInputBar]");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      `[generator.hooks.useInputBar.handleSubmit] Submitting... ${inputValue}`
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
        await dispatch(generateDateIdeas({ prompt: prompt })).unwrap();
      } catch (err) {
        setError(err as string);
        setLoading(false);
        resetForm();
        return;
      }

      // get first page
      try {
        dispatch(generatedIdeasPageChanged(1)); // set page to 1
        // await dispatch(getGeneratedIdeasPage({ page: 2 })).unwrap();
      } catch (err) {
        setError(err as string);
      } finally {
        setLoading(false);
        resetForm();
      }
    };

    // const generateIdeas = async () => {
    //   // TODO: refactor to use React Query
    //   setLoading(true);
    //   const prompt = inputValue;

    //   try {
    //     // Send the prompt for generation, and get the job ID.
    //     const {
    //       type: generateType,
    //       error: generateError,
    //       data: jobId,
    //     } = await generatorClient.generate(prompt);
    //     if (generateType === "error") {
    //       setError(generateError);
    //       setLoading(false);
    //       resetForm();
    //       return;
    //     }

    //     // Using the job ID, request for the first page.
    //     const {
    //       type: getPageType,
    //       error: getPageError,
    //       data: dateIdeasPage,
    //     } = await generatorClient.getPage(jobId as string, 1);
    //     if (getPageType === "error") {
    //       setError(getPageError);
    //       setLoading(false);
    //       resetForm();
    //       return;
    //     }

    //     // TODO: set global state of `jobId`
    //     // TODO: set global state of `curPage`
    //     // TODO: set global state of `generatedDateIdeasPage`
    //     log.info(
    //       `[generator.hooks.useInputBar.handleSubmit]: First page, ${dateIdeasPage}`
    //     );

    //     // Set the global state `generatedDateIdeas` to the first page.
    //   } catch (err) {
    //     setError(err as string);
    //   } finally {
    //     setLoading(false);
    //     resetForm();
    //   }
    // };

    generateIdeas();
  };

  return { inputValue, handleChange, handleSubmit, loading, error };
};

export const useFetchGeneratedIdeasPage = (
  page: number
): UseFetchResponse<Paginated<DateIdea>> => {
  const [data, setData] = useState<Paginated<DateIdea> | null>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // GLOBAL STATES
  const generatedIdeasPage = useAppSelector(selectGeneratedIdeasPage);

  // DISPATCH
  const dispatch = useAppDispatch();

  const fetchPage = async () => {
    setLoading(true);

    try {
      const res = await dispatch(
        getGeneratedIdeasPage({ page: page })
      ).unwrap();
      setData(res);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [page]);

  return {
    data: data as Paginated<DateIdea> | null,
    loading,
    error,
  };
};
