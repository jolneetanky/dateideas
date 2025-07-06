// export type ApiLocation = {
//   lat: float
// }

export type Location = {
  lat: number;
  lon: number;
  radius_km: number;
};

export type GenerateIdeasReq = {
  prompt: string;
  location?: Location;
  budget?: number;
};
