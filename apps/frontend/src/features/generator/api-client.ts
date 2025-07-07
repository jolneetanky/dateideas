import ApiClient, { ApiClientResponse } from "@/api/ApiClient";
import { JsonDateIdea, DateIdea } from "../dateidea/types";
import axios, { isAxiosError } from "axios";
import { GenerateIdeasReq, Location } from "./types";
import {
  ApiCursorResponse,
  ApiClientCursorResponse,
  ApiResponse,
} from "@/api/types";
// import dotenv from "dotenv";
// dotenv.config(); // Load environment variables from .env file

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("API Key:", API_BASE_URL); // Use the environment variable as needed

// HELPER FN
const getLocation = async (
  locationStr: string | null
): Promise<Location | null> => {
  console.log(`[GeneratorClient.location()] converting string to location...`);

  if (locationStr == "" || locationStr == null) {
    return null;
  }

  console.log(
    `[GeneratorClient.getLocation()] Converting locationStr to lat and lon...`
  );
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${locationStr}`
  );

  const data = await res.json();
  const lat = parseFloat(data[0].lat);
  const lon = parseFloat(data[0].lon);

  const location: Location = {
    lat: lat,
    lon: lon,
    radius_km: 50,
  };

  return location;
};
class GeneratorClient extends ApiClient<DateIdea> {
  // This function sends the prompt to BE,
  // and does long polling either it receives a BE response, or times out.
  // if successful, returns a `jobId` that we can call `generatorClient.getPage()` with.
  async generate(
    prompt: string,
    // location?: Location,
    locationStr: string | null,
    budget?: number
  ): Promise<ApiClientResponse<string>> {
    console.log(
      `[GeneratorClient.generate()] Formatting location. Prompt: ${prompt}, LocationStr: ${locationStr}`
    );

    const location = await getLocation(locationStr);

    const body: GenerateIdeasReq = {
      prompt: prompt,
      ...(location !== null && { location }),
      ...(budget !== undefined && { budget }),
    };

    console.log(`[GeneratorClient.generate()] Generating... Body`, body);

    try {
      const response = await axios.post<ApiResponse<string>>(
        `${API_BASE_URL}/generator/generate`,
        body
      );
      const { data: jobId, message, status, error } = response.data;
      console.log(
        `[GeneratorClient.generate()] SUCCESSFULLY GENERATED JOB: ${message}`
      );

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
    } catch (err) {
      let errMessage = "Unknown error";
      console.log("FAILED TO GENERATE DATE IDEAS", err);

      if (axios.isAxiosError(err)) {
        errMessage = err.response?.data.error;
      }

      return {
        status: "error",
        data: null,
        error: errMessage,
      };
    }
  }

  async getResult(
    jobId: string,
    cursor: string = "0",
    limit: number = 5,
    direction: "next" | "prev" = "next"
  ): Promise<ApiClientResponse<ApiClientCursorResponse<DateIdea>>> {
    console.log("[generator.apiClient.getDateIdea]");

    try {
      const url = `${API_BASE_URL}/generator/results/${jobId}?cursor=${cursor}&limit=${limit}&direction=${direction}`;
      console.log(`[generator.apiClient.getDateIdea] GET ${url}`);

      const response = await axios.get<
        ApiResponse<ApiCursorResponse<JsonDateIdea>>
      >(url);
      const { data, message: _message, status, error } = response.data;

      // format data
      const dateidea: DateIdea = {
        description: data?.data.description ?? "",
        dateLocations: data?.data.date_locations ?? [],
      };

      const nextCursor = data?.next_cursor;
      // const curCursor = data?.cur_cursor;
      const prevCursor = data?.prev_cursor;

      console.log(
        `[generator.apiClient.getDateIdea] Successfully fetched date idea for jobID ${jobId}. DATA: ${data}. NEXT_CURSOR: ${nextCursor}, PREV_CURSOR: ${prevCursor}`
      );

      const res: ApiClientCursorResponse<DateIdea> = {
        data: dateidea,
        nextCursor: nextCursor ?? "",
        prevCursor: prevCursor ?? "",
      };

      return {
        status: status,
        data: res,
        error: error,
      };
    } catch (err) {
      let errMessage = "Unknown error";

      console.log(
        "[generator.apiClient.getDateIdea] Failed to fetch date idea",
        err
      );

      if (isAxiosError(err)) {
        errMessage = err.response?.data.error;
      }

      return {
        status: "error",
        data: null,
        error: errMessage,
      };
    }
  }
}

const generatorClient = new GeneratorClient();
export default generatorClient;
