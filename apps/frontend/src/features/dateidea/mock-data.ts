import { Paginated } from "../pagination/types";
import { DateIdea } from "./types";

export const dateideas = [
  {
    id: "1",
    title: "MBS",
    description: "Enjoy a chill night out at MBS",
    budget: "$$",
    tags: ["hotel, beach, fun, sand"],
    link: "link.com",
  },
  {
    id: "2",
    title: "Changi Beach",
    description: "Hit the waves at Changi Beach with your partner!",
    budget: "",
    tags: ["beach", "fun,", "sand", "nice"],
    link: "link.com",
  },
  {
    id: "3",
    title: "Godzilla exhibition",
    description: "Roar",
    budget: "$",
    tags: ["Godzilla"],
    link: "link.com",
  }
];

export const page: Paginated<DateIdea> = {
  data: dateideas,
  page: 1,
  limit: 10, 
  totalItems: 47,
  totalPages: 5,
}