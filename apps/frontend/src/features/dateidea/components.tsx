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
};

const DateLocationList = ({ locations }: { locations: DateLocation[] }) => {
  return (
    <List className="flex flex-col items-center justify-center h-full w-full">
      {locations.map((item) => (
        <DateLocationCard location={item} key={item.id} />
      ))}
    </List>
  );
};

export { DateLocationCard, DateLocationList };
