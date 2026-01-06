import { Location } from "../entities/Location";

export interface ILocationRepository {
  getCurrentLocation(idPromotor: string): Promise<Location>;
  getLocationHistory(idPromotor: string): Promise<Location[]>;
  sendLocation(payload: {
    idPromotor: string;
    latitude: number;
    longitude: number;
    timestamp: number;
  }): Promise<void>;
}
