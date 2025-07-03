/*
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
*/

import { Button } from "@mantine/core";

const Style = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
  },
  button: {
    padding: "0.5rem 1rem",
  },
};

type LoadMoreProps = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export const LoadMore = ({
  onClick,
  disabled = false,
  loading = false,
}: LoadMoreProps) => {
  return (
    <div className={Style.wrapper}>
      <Button
        onClick={onClick}
        disabled={disabled}
        loading={loading}
        variant="light"
        className={Style.button}
      >
        Load More
      </Button>
    </div>
  );
};
