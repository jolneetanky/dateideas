export type DateLocation = {
  id: string;
  name: string;
  amenity: string;
  link: string;
  address: string;
};

export type DateIdea = {
  description: string;
  dateLocations: DateLocation[];
};

export type ApiDateIdea = {
  description: string;
  date_locations: DateLocation[];
};
