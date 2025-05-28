import { useState } from "react";
import { Input, CloseButton } from "@mantine/core";

const TextInput = ({ className }: { className?: string }) => {
  const [value, setValue] = useState("Clear me");

  return (
    <div className={`${className}`}>
      <Input
        placeholder="Clearable input"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        rightSectionPointerEvents="all"
        mt="md"
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => setValue("")}
            style={{ display: value ? undefined : "none" }}
          />
        }
      />
    </div>
  );
};

export default TextInput;
