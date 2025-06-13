import { initLogger } from "@/lib/logger";
import React, { useState } from "react";
import generatorClient from "./api-client";

export const useInputBar = () => {
  const log = initLogger("[generator.hooks.useInputBar]");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    // TODO: send request to /api/dateideas/generate, and await the response.
    // await generatorClient.get(inputValue)
    // either that or dateIdeaClient.generate(inputValue)
    // either way works, just a matter of preference
    const generateIdeas = async () => {
      setLoading(true);
      const prompt = inputValue;

      try {
        // Send the prompt for generation, and get the job ID.
        const {
          type: generateType,
          error: generateError,
          data: jobId,
        } = await generatorClient.generate(prompt);
        if (generateType === "error") {
          setError(generateError);
          setLoading(false);
          resetForm();
          return;
        }

        // Using the job ID, request for the first page.
        const {
          type: getPageType,
          error: getPageError,
          data: dateIdeasPage,
        } = await generatorClient.getPage(jobId as number, 1);
        if (getPageType === "error") {
          setError(getPageError);
          setLoading(false);
          resetForm();
          return;
        }

        log.info(
          `[generator.hooks.useInputBar.handleSubmit]: First page, ${dateIdeasPage}`
        );

        // Set the global state `generatedDateIdeas` to the first page.
      } catch (err) {
        setError(err as string);
      } finally {
        setLoading(false);
        resetForm();
      }
    };

    generateIdeas();
  };

  return { inputValue, handleChange, handleSubmit, loading, error };
};
