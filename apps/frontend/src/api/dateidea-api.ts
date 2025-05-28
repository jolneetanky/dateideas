import { Paginated } from "@/features/pagination/types";
import { DateIdea } from "@/features/dateidea/types";
import { ApiResponse } from "./types";

const dateideas = [
  {
    id: "5",
    title: "MBS",
    description: "nice",
  },
  {
    id: "10",
    title: "Prata Place",
    description: "nice",
  }
];

const dateIdeaPages: Paginated<DateIdea>[] = [
    {
        data: [
            {
                id: "1",
                title: "MBS",
                description: "nice",
            }, {
                id: "2",
                title: "Prata Shop",
                description: "tasty",
            }
        ],
        page: 1,
        limit: 2,
        totalItems: 3,
        totalPages: 2,
    }, {
        data: [
            {
                id: "3",
                title: "GBTB",
                description: "fowers"
            }
        ],
        page: 2,
        limit: 2,
        totalItems: 3,
        totalPages: 2,
    }
]

class MockDateIdeaApi {
    async getAll(): Promise<ApiResponse<DateIdea[]>> {
        return ({
            status: "success",
            message: "",
            data: dateideas,
            error: "",
        })
    }
    async getById(id: string): Promise<ApiResponse<DateIdea>> {
        const dateidea = dateideas.filter(idea => idea.id === id).at(0);
        const status = (dateidea == undefined ? "error" : "success");
        const error = (dateidea == undefined ? "invalid DateIdea ID" : "")
        const data = (dateidea == undefined ? null : dateidea)
        return ({
            status: status,
            message: "",
            data: data,
            error: error,
        })
    }
    async getPage(page: number, pageSize: number): Promise<ApiResponse<Paginated<DateIdea>>> {
        const res = dateIdeaPages.filter(pg => pg.page === page).at(0);
        const status = (res == undefined ? "error" : "success");
        const error = (res == undefined ? "page does not exist" : "")
        const data = (res == undefined ? null : res)
        return ({
            status: status,
            message: "",
            data: data,
            error: error,
        })
    }
}

const mockDateIdeaApi = new MockDateIdeaApi;
export default mockDateIdeaApi;