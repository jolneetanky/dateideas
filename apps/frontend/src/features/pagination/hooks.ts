import { UseFetchResponse } from "@/common/types/hooks";
import { Pagination } from "./types";

type usePaginatedFetchArg<T> = {
    fetchFunction: (page: number, pageSize: number) => Promise<Pagination<T>>,
    page: number,
    limit: number,
}

// const usePaginatedFetch<T> = ({fetchFunction, page, limit}: usePaginatedFetchArg): UseFetchResponse => {

// }