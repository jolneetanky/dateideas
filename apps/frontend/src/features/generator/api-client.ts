import ApiClient, { ApiClientResponse } from "@/api/ApiClient";
import { ApiDateIdea, DateIdea } from "../dateidea/types";
import { Paginated } from "../pagination/types";
import mockGeneratorApi from "@/api/generator-api";
import axios from "axios";
import { GenerateIdeasReq } from "./types";
import { initLogger } from "@/lib/logger";
import { ApiResponse } from "@/api/types";

const API_BASE_URL = "http://localhost:8000";
class GeneratorClient extends ApiClient<DateIdea> {
  // This function sends the prompt to BE,
  // and does long polling either it receives a BE response, or times out.
  // if successful, returns a `jobId` that we can call `generatorClient.getPage()` with.
  async generate(
    prompt: string,
    location: string = "Singapore",
    budget: number = -1
  ): Promise<ApiClientResponse<string>> {
    // const { data, status, error } = await mockGeneratorApi.generate(prompt);
    const log = initLogger("GeneratorClient.generate()");
    log.info("GENERATING");

    const body: GenerateIdeasReq = {
      prompt: prompt,
      location: location,
      // budget: budget,
    };
    try {
      const response = await axios.post<ApiResponse<string>>(
        `${API_BASE_URL}/generator/generate`,
        body
      );
      const { data: jobId, message, status, error } = response.data;
      log.info(`SUCCESSFULLY GENERATED JOB: ${message}`);

      // await new Promise((resolve) => setTimeout(resolve, 3000));
      // Polling logic
      const timeout = 40000; // 40 seconds max wait
      const interval = 3000; // poll every 3 seconds
      const start = Date.now();

      while (Date.now() - start < timeout) {
        console.log(`[generator.apiclient.generate()] POLLING...`);
        const getStatusResponse = await axios.get<
          ApiResponse<"success" | "pending" | "error">
        >(`${API_BASE_URL}/generator/status/${jobId}`);
        const { data: jobStatus } = getStatusResponse.data;

        if (jobStatus === "success") {
          return {
            status: status,
            data: jobId,
            error: error,
          };
        }

        // block for `interval` seconds
        await new Promise((resolve) => setTimeout(resolve, interval));
      }

      // timeout reached
      return {
        status: "error",
        data: null,
        error: "Timed out while waiting for generation to complete.",
      };
    } catch (err: any) {
      console.log("FAILED TO GENERATE DATE IDEAS", err);
      log.error(`FAILED TO GENERATE DATE IDEAS: ${err}`);
      return {
        status: "error",
        data: null,
        error: err?.response?.data?.error || "Unknown error",
      };
    }

    // TODO: incorporate polling logic.
  }

  async getPage(
    jobId: string,
    page: number
  ): Promise<ApiClientResponse<Paginated<DateIdea>>> {
    console.log("[generator.apiClient.getPage]");
    const { data, status, error } = await mockGeneratorApi.getPage(jobId, page);
    // ACTUAL: get dateideas from BE
    // format into mock page for now (cause BE dh pagination yet)

    return {
      status: status,
      data: data,
      error: error,
    };
  }

  async getDateIdea(jobId: string): Promise<ApiClientResponse<DateIdea>> {
    console.log("[generator.apiClient.getDateIdea]");

    try {
      const response = await axios.get<ApiResponse<ApiDateIdea>>(
        `${API_BASE_URL}/generator/results/${jobId}`
      );
      const { data, message, status, error } = response.data;
      console.log(
        `[generator.apiClient.getDateIdea] Successfully fetched date idea for jobID ${jobId}`
      );
      console.log("DATA:", data);

      // format data
      const dateidea: DateIdea = {
        description: data?.description ?? "",
        dateLocations: data?.date_locations ?? [],
      };

      return {
        status: status,
        data: dateidea,
        error: error,
      };
    } catch (err: any) {
      console.log(
        "[generator.apiClient.getDateIdea] Failed to fetch date iidea",
        err
      );
      return {
        status: "error",
        data: null,
        error: err?.response?.data?.error || "Unknown error",
      };
    }
  }
}

const generatorClient = new GeneratorClient();
export default generatorClient;
