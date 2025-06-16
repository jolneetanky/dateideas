"use client";
// I'll just put this inside this folder first.
// Refactor if needed tmr.
// FOR NOW, I WANT IT SUCH THAT
// 1) when usser fills up input bar, the state is logged
// 2) when user clicks "generate", we send all that into to some mock API.

import { Button, TextInput } from "@mantine/core";
import { PageNav } from "../pagination/components";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  generatedIdeasPageNumberChanged,
  selectGeneratedIdeasPageNumber,
} from "./slice";

const InputBarStyle = {
  container: {
    display: "flex",
    gap: 10,
  },
};

export const InputBar = ({
  inputValue,
  handleChange,
  handleSubmit,
}: {
  inputValue: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) => {
  return (
    <form style={InputBarStyle.container} onSubmit={handleSubmit}>
      <TextInput
        placeholder="Enter a prompt"
        value={inputValue}
        onChange={handleChange}
      />
      <Button variant="filled" type="submit">
        Generate
      </Button>
    </form>
  );
};

export const GeneratedIdeasPageNav = () => {
  const dispatch = useAppDispatch();
  const curPage = useAppSelector(selectGeneratedIdeasPageNumber);

  const handlePageChange = (page: number) => {
    dispatch(generatedIdeasPageNumberChanged(page));
  };

  return (
    <PageNav
      totalPages={5}
      handlePageChange={handlePageChange}
      curPage={curPage}
    />
  );
};
