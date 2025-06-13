import ApiClient, { ApiClientResponse } from "@/api/ApiClient";
import { DateIdea } from "../dateidea/types";
import { Paginated } from "../pagination/types";
import mockGeneratorApi from "@/api/generator-api";

class GeneratorClient extends ApiClient<DateIdea> {
  // This function sends the prompt to BE,
  // and does long polling either it receives a BE response, or times out.
  // if successful, returns a `jobId` that we can call `generatorClient.getPage()` with.
  async generate(prompt: string): Promise<ApiClientResponse<string>> {
    const { data, status, error } = await mockGeneratorApi.generate(prompt);

    // TODO: incorporate polling logic.

    return {
      type: status,
      data: data,
      error: error,
    };
  }

  async getPage(
    jobId: string,
    page: number
  ): Promise<ApiClientResponse<Paginated<DateIdea>>> {
    const { data, status, error } = await mockGeneratorApi.getPage(jobId, page);

    return {
      type: status,
      data: data,
      error: error,
    };
  }
}

const generatorClient = new GeneratorClient();
export default generatorClient;
