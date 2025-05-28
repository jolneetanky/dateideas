import { Pagination } from "../pagination/types";
import { DateIdea } from "./types";

export const dateideas = [
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

export const page: Pagination<DateIdea> = {
  data: dateideas,
  page: 1,
  limit: 10, 
  totalItems: 47,
  totalPages: 5,
}