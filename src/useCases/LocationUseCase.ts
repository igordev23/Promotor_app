import { ILocationRepository } from "../model/repositories/ILocationRepository";
import { Location } from "../model/entities/Location";
import { LocationRepository } from "../model/repositories/LocationRepository";

export class LocationUseCase {
  constructor(private repository: ILocationRepository) {}

  async getCurrentLocation(idPromotor: string): Promise<Location> {
    return this.repository.getCurrentLocation(idPromotor);
  }

  async getLocationHistory(idPromotor: string): Promise<Location[]> {
    return this.repository.getLocationHistory(idPromotor);
  }

  async sendLocation(data: {
    idPromotor: string;
    latitude: number;
    longitude: number;
    timestamp: number;
  }): Promise<void> {
    return this.repository.sendLocation(data);
  }

  parseError(err: unknown, fallback = "Ocorreu um erro"): string {
    if (!err) return fallback;
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message || fallback;
    if (typeof err === "object" && err !== null && "message" in (err as any)) {
      const m = (err as any).message;
      return typeof m === "string" ? m : fallback;
    }
    try {
      return JSON.stringify(err) || fallback;
    } catch {
      return fallback;
    }
  }
}

export const locationUseCase = new LocationUseCase(new LocationRepository());
