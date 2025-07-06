"use client";

import { Button, Select, TextInput } from "@mantine/core";

const InputBarStyle = {
  container: {
    display: "flex",
    gap: 10,
    marginBottom: "0.75rem",
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
    <form onSubmit={handleSubmit}>
      <div style={InputBarStyle.container}>
        <TextInput
          placeholder="Enter a prompt"
          value={inputValue}
          onChange={handleChange}
        />
        <Button variant="filled" type="submit">
          Generate
        </Button>
      </div>

      <Select
        placeholder="Select location"
        value={locationVal}
        onChange={handleLocationChange}
        data={[{ value: "singapore", label: "Singapore" }]}
      />
    </form>
  );
};
