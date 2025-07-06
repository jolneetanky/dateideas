import ApiClient, { ApiClientResponse } from "@/api/ApiClient";
import { JsonDateIdea, DateIdea } from "../dateidea/types";
import axios from "axios";
import { GenerateIdeasReq, Location } from "./types";
import {
  ApiCursorResponse,
  ApiClientCursorResponse,
  ApiResponse,
} from "@/api/types";

const API_BASE_URL = "http://localhost:8000";

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
    } catch (err: any) {
      console.log("FAILED TO GENERATE DATE IDEAS", err);
      return {
        status: "error",
        data: null,
        error: err?.response?.data?.error || "Unknown error",
      };
    }
  }

  async getResult(
    jobId: string,
    after: string = "0",
    limit: number = 5
  ): Promise<ApiClientResponse<ApiClientCursorResponse<DateIdea>>> {
    console.log("[generator.apiClient.getDateIdea]");

    try {
      const url = `${API_BASE_URL}/generator/results/${jobId}?after=${after}&limit=${limit}`;
      const response = await axios.get<
        ApiResponse<ApiCursorResponse<JsonDateIdea>>
      >(url);
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
        "[generator.apiClient.getDateIdea] Failed to fetch date idea",
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
