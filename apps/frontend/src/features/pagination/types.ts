import { usePagination } from "@mantine/hooks";

export type Paginated<T> = {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  data: T[];
};

export type UsePaginationReturn = ReturnType<typeof usePagination>;
