import { DateIdea } from "../dateidea/types";
import { Paginated } from "./types";

const dateideaPages: Paginated<DateIdea>[] = [
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

export {
    dateideaPages,
}