// let's say this guy gives us data from a separate DB of generated DateIdeas.
// columns look something like { jobId | Paginated<DateIdea>[] }
import { Paginated } from "@/features/pagination/types";
import { DateIdea } from "@/features/dateidea/types";
import { ApiResponse } from "./types";

// this is how it looks like for a particular jobID
const job1: Paginated<DateIdea>[] = [
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

const job2: Paginated<DateIdea>[] = [
  {
    pageNumber: 1,
    pageSize: 2,
    totalItems: 3,
    totalPages: 2,
    data: [
      {
        id: "2",
        title: "MBS",
        description: "Enjoy a nice dinner at <some MBS restaurant>",
        budget: "50,000",
        tags: ["nice", "wind", "singapore"],
      },
      {
        id: "4",
        title: "Sentosa Beach",
        description: "beach !",
        budget: "3034",
        tags: ["fake merlion", "grass"],
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

const generatedDateIdeas = new Map<string, Paginated<DateIdea>[]>();
generatedDateIdeas.set("1", job1);
generatedDateIdeas.set("2", job2);

class MockGeneratorApi {
  // returns a jobID which we then use to query the DB.
  async generate(prompt: string): Promise<ApiResponse<string>> {
    console.log(prompt); // placed here for to bypass linting

    // I think in the actual implementation, we'll have to return the jobID or something as well
    // so we can request another page of generated date ideas belonging to the same jobID
    const status = "success";
    const message = "";
    const error = "";
    const jobId = "1";

    return {
      status: status,
      message: message,
      error: error,
      data: jobId,
    };
  }

  async getPage(
    jobId: string,
    page: number
  ): Promise<ApiResponse<Paginated<DateIdea>>> {
    console.log(page); // placed here for to bypass linting

    let status: "success" | "error" = "success";
    const message = "";
    let error = "";
    let data;

    if (!generatedDateIdeas.has(jobId)) {
      status = "error";
      error = "job ID does not exist";
      data = null;
    } else {
      status = "success";
      const pages = generatedDateIdeas.get(jobId);
      data = pages?.filter(
        (pg) => pg.pageNumber === page
      )[0] as Paginated<DateIdea>;
    }

    return {
      status: status,
      message: message,
      error: error,
      data: data,
    };
  }
}

const mockGeneratorApi = new MockGeneratorApi();
export default mockGeneratorApi;
