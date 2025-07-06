import { Button } from "@mantine/core";
import styles from "./styles.module.css";

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
    <div className={styles.wrapper}>
      <Button
        onClick={onClick}
        disabled={disabled}
        loading={loading}
        variant="light"
        className={styles.button}
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
    <div className={styles.wrapper}>
      <Button
        onClick={onClick}
        disabled={disabled}
        loading={loading}
        variant="light"
        className={styles.button}
      >
        Load Previous
      </Button>
    </div>
  );
};
