"use client";
import { DateIdea, DateLocation } from "./types";
import { List } from "@mantine/core";

const DateLocationCard = ({ location }: { location: DateLocation }) => {
  return (
    <div>
      {location.name}
      {location.amenity}
      {location.address}
    </div>
  );
  // return (
  //   <Card shadow="sm" padding="lg" radius="md" withBorder>
  //     <Card.Section>
  //       <Image
  //         src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
  //         height={200}
  //         width={200}
  //         alt="Norway"
  //       />
  //     </Card.Section>

  //     <Group justify="space-between" mt="md" mb="xs">
  //       <Text fw={500}>{dateidea.title}</Text>
  //       <Badge color="pink">On Sale</Badge>
  //     </Group>

  //     <Text size="sm" c="dimmed">
  //       {dateidea.description}
  //     </Text>

  //     <Button color="blue" fullWidth mt="md" radius="md">
  //       Book classic tour now
  //     </Button>
  //   </Card>
  // );
};

const DateLocationList = ({ locations }: { locations: DateLocation[] }) => {
  console.log("LOCATIONS:", locations);
  return (
    <List className="flex flex-col items-center justify-center h-full w-full">
      {locations.map((item) => (
        <DateLocationCard location={item} key={item.id} />
      ))}
    </List>
  );
};

export { DateLocationCard, DateLocationList };
