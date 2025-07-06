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

// The JSON type returned by our API
export type JsonDateIdea = {
  description: string;
  date_locations: DateLocation[];
};
