import { usePagination } from "@mantine/hooks";

export type Paginated<T> = {
    data: T[];
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export type UsePaginationReturn = ReturnType<typeof usePagination>;