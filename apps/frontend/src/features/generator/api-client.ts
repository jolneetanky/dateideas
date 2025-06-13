import ApiClient, { ApiClientResponse } from "@/api/ApiClient";
import { DateIdea } from "../dateidea/types";
import { Paginated } from "../pagination/types";
import mockGeneratorApi from "@/api/generator-api";

class GeneratorClient extends ApiClient<DateIdea> {
  // async get(prompt: string): Promise<ApiClientResponse<Paginated<DateIdea>>> {
  //     const dateIdeasPage = await mockDateIdeaApi.
  // }
  async generate(prompt: string): Promise<ApiClientResponse<number>> {
    const { data, status, error } = await mockGeneratorApi.generate(prompt);
    return {
      type: status,
      data: data,
      error: error,
    };
  }

  async getPage(
    jobId: number,
    page: number
  ): Promise<ApiClientResponse<Paginated<DateIdea>>> {
    const { data, status, error } = await mockGeneratorApi.getPage(page);

    return {
      type: status,
      data: data,
      error: error,
    };
  }
}

const generatorClient = new GeneratorClient();
export default generatorClient;
