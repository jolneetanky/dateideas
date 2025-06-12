import { Paginated } from "@/features/pagination/types";
import { DateIdea } from "@/features/dateidea/types";
import { ApiResponse } from "./types";

// KEY QUESTION: in actual BE implementation, do we keep paginated data separate from the actual store of all data?

const dateIdeaPages: Paginated<DateIdea>[] = [
  {
    pageNumber: 1,
    pageSize: 2,
    totalItems: 3,
    totalPages: 2,
    data: [
      {
        id: "1",
        title: "Changi Beach",
        description: "Enjoy a nice walk along Changi Beach",
        budget: "20",
        tags: ["sand", "hot", "nice"],
      },
      {
        id: "2",
        title: "MBS",
        description: "Enjoy a nice dinner at <some MBS restaurant>",
        budget: "50,000",
        tags: ["nice", "wind", "singapore"],
      },
    ],
  },
  {
    pageNumber: 2,
    pageSize: 2,
    totalItems: 3,
    totalPages: 2,
    data: [
      {
        id: "3",
        title: "Pasir Ris Park",
        description:
          "Have a heart-to-heart talk at Pasir Ris Park, along the boardwalk.",
        budget: "0",
        tags: ["boardwalk", "water cooler"],
      },
    ],
  },
];

class MockDateIdeaApi {
  // async getAll(): Promise<ApiResponse<DateIdea[]>> {
  //     return ({
  //         status: "success",
  //         message: "",
  //         data: dateideas,
  //         error: "",
  //     })
  // }
  // TODO: implement later!
  //   async getById(id: string): Promise<ApiResponse<DateIdea>> {
  //     const dateidea = dateideas.filter((idea) => idea.id === id).at(0);
  //     const status = dateidea == undefined ? "error" : "success";
  //     const error = dateidea == undefined ? "invalid DateIdea ID" : "";
  //     const data = dateidea == undefined ? null : dateidea;
  //     return {
  //       status: status,
  //       message: "",
  //       data: data,
  //       error: error,
  //     };
  //   }
  // async getPage(page: number, pageSize: number): Promise<ApiResponse<Paginated<DateIdea>>> {
  //     const res = dateIdeaPages.filter(pg => pg.page === page).at(0);
  //     const status = (res == undefined ? "error" : "success");
  //     const error = (res == undefined ? "page does not exist" : "")
  //     const data = (res == undefined ? null : res)
  //     return ({
  //         status: status,
  //         message: "",
  //         data: data,
  //         error: error,
  //     })
  // }
}

const mockDateIdeaApi = new MockDateIdeaApi();
export default mockDateIdeaApi;
