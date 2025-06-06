"use client";
import { DateIdea } from "./types";
import { useState } from "react";
import {
  Input,
  CloseButton,
  Button,
  List,
  Card,
  Image,
  Text,
  Badge,
  Group,
} from "@mantine/core";

const DateIdeaCard = ({ dateidea }: { dateidea: DateIdea }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
          height={200}
          width={200}
          alt="Norway"
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{dateidea.title}</Text>
        <Badge color="pink">On Sale</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        {dateidea.description}
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button>
    </Card>
  );
};

const DateIdeaList = ({ dateideas }: { dateideas: DateIdea[] }) => {
  return (
    <List className="flex flex-col items-center justify-center h-full w-full">
      {dateideas.map((item) => (
        <DateIdeaCard dateidea={item} key={item.id} />
      ))}
    </List>
  );
};

const GeneratorInput = ({
  className,
  handleGenerate,
}: {
  className?: string;
  handleGenerate: () => void;
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    event?.preventDefault();
    handleGenerate();
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
