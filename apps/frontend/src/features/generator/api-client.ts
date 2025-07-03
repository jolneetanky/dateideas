import ApiClient, { ApiClientResponse } from "@/api/ApiClient";
import { JsonDateIdea, DateIdea } from "../dateidea/types";
import axios from "axios";
import { GenerateIdeasReq } from "./types";
import { initLogger } from "@/lib/logger";
import {
  ApiCursorResponse,
  ApiClientCursorResponse,
  ApiResponse,
} from "@/api/types";
import next from "next";

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
      budget: budget,
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

  async getResult(
    jobId: string,
    after?: string,
    limit?: number
  ): Promise<ApiClientResponse<ApiClientCursorResponse<DateIdea>>> {
    console.log("[generator.apiClient.getDateIdea]");

    try {
      const response = await axios.get<
        ApiResponse<ApiCursorResponse<JsonDateIdea>>
      >(`${API_BASE_URL}/generator/results/${jobId}`);
      const { data, message, status, error } = response.data;
      console.log(
        `[generator.apiClient.getDateIdea] Successfully fetched date idea for jobID ${jobId}`
      );
      console.log("DATA:", data);

      // format data
      const dateidea: DateIdea = {
        description: data?.data.description ?? "",
        dateLocations: data?.data.date_locations ?? [],
      };

      const nextCursor = data?.next_cursor;

      const res: ApiClientCursorResponse<DateIdea> = {
        data: dateidea,
        nextCursor: nextCursor ?? "",
      };

      return {
        status: status,
        data: res,
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
