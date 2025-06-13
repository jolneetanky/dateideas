"use client";
// I'll just put this inside this folder first.
// Refactor if needed tmr.
// FOR NOW, I WANT IT SUCH THAT
// 1) when usser fills up input bar, the state is logged
// 2) when user clicks "generate", we send all that into to some mock API.

import { Button, TextInput } from "@mantine/core";
import { useInputBar } from "./hooks";
import { PageNav } from "../pagination/components";
import { useAppDispatch } from "@/lib/redux/hooks";
import { generatedIdeasPageChanged } from "./slice";

const InputBarStyle = {
  container: {
    display: "flex",
    gap: 10,
  },
};

export const InputBar = () => {
  const { inputValue, handleChange, handleSubmit /*loading, error*/ } =
    useInputBar();

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
  // when i toggle the page, my pages should update accordingly.
  const dispatch = useAppDispatch();

  const handlePageChange = (page: number) => {
    dispatch(generatedIdeasPageChanged(page));
  };

  return <PageNav totalPages={5} handlePageChange={handlePageChange} />;
};
