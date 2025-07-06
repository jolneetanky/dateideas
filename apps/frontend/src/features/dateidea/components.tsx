"use client";
import { Card, Text, Anchor, Badge, Group } from "@mantine/core";
import { DateLocation } from "./types";
import { List } from "@mantine/core";
import styles from "./styles.module.css";

const DateLocationCard = ({ location }: { location: DateLocation }) => {
  return (
    <Card shadow="sm" radius="md" withBorder className={styles.card} mb="sm">
      <Group justify="space-between" mb="xs">
        <Text fw={500}>{location.name}</Text>
        <Badge color="blue" variant="light">
          {location.amenity}
        </Badge>
      </Group>

      <Anchor
        href={location.link}
        target="_blank"
        rel="noopener noreferrer"
        size="sm"
        c="dimmed"
      >
        View on Google Maps →
      </Anchor>
    </Card>
  );
};

const DateLocationList = ({ locations }: { locations: DateLocation[] }) => {
  return (
    <List>
      {locations.map((item) => (
        <DateLocationCard location={item} key={item.id} />
      ))}
    </List>
  );
};

const DateDescription = ({ description }: { description: string }) => {
  return (
    <Text size="md" fw={500} style={{ marginBottom: "1rem" }}>
      {description}
    </Text>
  );
};

export { DateLocationList, DateDescription };
