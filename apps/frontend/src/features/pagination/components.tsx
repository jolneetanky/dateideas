import { Pagination } from "@mantine/core";

export const PageNav = ({
  totalPages,
  curPage,
  handlePageChange,
}: {
  totalPages: number;
  curPage: number;
  handlePageChange: (page: number) => void;
  // pagination: UsePaginationReturn;
}) => {
  return (
    <>
      <Pagination
        // onChange={pagination.setPage}
        value={curPage}
        onChange={handlePageChange}
        total={totalPages}
        autoContrast
        color="lime.4"
      />
    </>
  );
};
