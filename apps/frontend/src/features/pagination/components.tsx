import { Pagination } from "@mantine/core";

export const PageNav = ({
  totalPages,
  handlePageChange,
}: {
  totalPages: number;
  handlePageChange: (page: number) => void;
  // pagination: UsePaginationReturn;
}) => {
  return (
    <>
      <Pagination
        // onChange={pagination.setPage}
        onChange={handlePageChange}
        total={totalPages}
        autoContrast
        color="lime.4"
      />
    </>
  );
};
