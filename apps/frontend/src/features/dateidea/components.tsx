"use client";
import { DateIdea } from "./types";
import { useState } from "react";
import { Input, CloseButton, Button, List, ListItem } from "@mantine/core";

const DateIdeaCard = ({ dateidea }: { dateidea: DateIdea }) => {
  return (
    <div className="flex flex-col">
      {dateidea.title}
      {dateidea.description}
    </div>
  );
};

const DateIdeaList = ({ dateideas }: { dateideas: DateIdea[] }) => {
  return (
    <List>
      {dateideas.map((item) => (
        <DateIdeaCard dateidea={item} key={item.id} />
      ))}
    </List>
  );
};

const GeneratorInput = ({ className }: { className?: string }) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    event?.preventDefault();
    console.log("SUBMITTED");
  };

  return (
    <form
      className={`${className} w-full flex justify-between`}
      onSubmit={handleSubmit}
    >
      <Input
        placeholder="Clearable input"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        rightSectionPointerEvents="all"
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => setValue("")}
            style={{ display: value ? undefined : "none" }}
          />
        }
      />
      <Button type="submit">Generate</Button>
    </form>
  );
};

export { DateIdeaCard, DateIdeaList, GeneratorInput };
