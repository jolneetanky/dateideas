import { Pagination } from "@mantine/core";

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
