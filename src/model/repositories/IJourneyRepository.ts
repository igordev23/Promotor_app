import { Journey } from "../entities/Journey";

export interface IJourneyRepository {
  startJourney(idPromotor: string): Promise<void>;
  endJourney(idPromotor: string): Promise<void>;
  getJourneyStatus(idPromotor: string): Promise<Journey>;
}
