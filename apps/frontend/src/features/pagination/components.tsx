import { Pagination, Text } from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { Paginated, UsePaginationReturn } from "./types";

export const PageNav = ({
  totalPages,
  setPage,
}: {
  totalPages: number;
  setPage: (prev: number) => void;
  // pagination: UsePaginationReturn;
}) => {
  return (
    <>
      <Pagination
        // onChange={pagination.setPage}
        onChange={setPage}
        total={totalPages}
        autoContrast
        color="lime.4"
      />
    </>
  );
};
