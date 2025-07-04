"use client";
// I'll just put this inside this folder first.
// Refactor if needed tmr.
// FOR NOW, I WANT IT SUCH THAT
// 1) when usser fills up input bar, the state is logged
// 2) when user clicks "generate", we send all that into to some mock API.

import { Button, Select, TextInput } from "@mantine/core";

const InputBarStyle = {
  container: {
    display: "flex",
    gap: 10,
  },
};

export const InputBar = ({
  inputValue,
  locationVal,
  handleChange,
  handleSubmit,
  handleLocationChange,
}: {
  inputValue: string;
  locationVal: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleLocationChange: (val: string | null) => void;
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

      <Select
        placeholder="Select location"
        value={locationVal}
        onChange={handleLocationChange}
        data={[{ value: "singapore", label: "Singapore" }]}
      />
    </form>
  );
};
