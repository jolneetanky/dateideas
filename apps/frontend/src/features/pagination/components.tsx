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

type LoadPrevProps = {
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

export const LoadPrev = ({
  onClick,
  disabled = false,
  loading = false,
}: LoadPrevProps) => {
  return (
    <div className={Style.wrapper}>
      <Button
        onClick={onClick}
        disabled={disabled}
        loading={loading}
        variant="light"
        className={Style.button}
      >
        Load Previous
      </Button>
    </div>
  );
};
