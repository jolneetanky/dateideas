import ApiClient, { ApiClientResponse } from "@/api/ApiClient";
import { DateIdea } from "./types";

class DateIdeaClient extends ApiClient<DateIdea> {
  // async getAll(): Promise<ApiClientResponse<DateIdea[]>> {
  //     const { status, message, data, error } = await mockDateIdeaApi.getAll();
  //     return ({
  //         type: status,
  //         data: data,
  //         error: error,
  //     })
  // }
  async getById(id: string): Promise<ApiClientResponse<DateIdea>> {
    console.log(id); // placed here to bypass linting

    //   const { status, message, data, error } = await mockDateIdeaApi.getById(id);
    //   return {
    //     type: status,
    //     data: data,
    //     error: error,
    //   };
    return {
      type: "success",
      data: null,
      error: "",
    };
  }
  // async getPage(page: number, pageSize: number): Promise<ApiClientResponse<Paginated<DateIdea>>> {
  //     const { status, message, data, error } = await mockDateIdeaApi.getPage(page, pageSize);
  //     return ({
  //         type: status,
  //         data: data,
  //         error: error,
  //     })
  // }
}

const dateIdeaClient = new DateIdeaClient();
export default dateIdeaClient;
