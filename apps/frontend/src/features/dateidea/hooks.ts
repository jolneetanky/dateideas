// import { UseFetchResponse } from "@/common/types/hooks";
// import { DateIdea } from "./types";
// import { Paginated } from "../pagination/types";
// import { useQuery } from "@tanstack/react-query";
// import generatorClient from "../generator/api-client";

// // helps us fetch a page.
// // returns the page data, error, and loading states.
// // fetch based on jobId.
// // fetches a page of dateideas I guess but idk where I will use this.. we'll see
// const usePaginatedFetch = (
//   page: number,
//   pageSize: number,
//   jobId: string
// ): UseFetchResponse<Paginated<DateIdea>> => {
//   const { isPending, data, error } = useQuery({
//     queryKey: ["dateideas", page, pageSize, jobId], // REACT QUERY REFETCHES WHEN ANY OF THESE CHANGE!!
//     queryFn: () => generatorClient.getPage(page, pageSize),
//   });

//   let res;
//   if (
//     !data ||
//     jobId === "" ||
//     data?.data === null ||
//     data?.data === undefined
//   ) {
//     res = null;
//   } else {
//     res = data.data;
//   }

//   return {
//     data: res,
//     error: error?.message ?? "",
//     loading: isPending,
//   };
// };

// export { usePaginatedFetch };
