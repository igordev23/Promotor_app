import { IJourneyRepository } from "../model/repositories/IJourneyRepository";
import { Journey } from "../model/entities/Journey";
import { JourneyRepository } from "../model/repositories/JourneyRepository";

export class JourneyUseCase {
  constructor(private repository: IJourneyRepository) {}

  async startJourney(idPromotor: string): Promise<number | void> {
    return this.repository.startJourney(idPromotor);
  }

  async endJourney(idPromotor: string): Promise<number | void> {
    return this.repository.endJourney(idPromotor);
  }

  async getJourneyStatus(idPromotor: string): Promise<Journey> {
    return this.repository.getJourneyStatus(idPromotor);
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

export const journeyUseCase = new JourneyUseCase(new JourneyRepository());
