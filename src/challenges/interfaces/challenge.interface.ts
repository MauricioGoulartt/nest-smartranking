import { Document } from "mongoose";
import { Player } from "src/players/interfaces/player.interface";
import { ChallengeStatus } from "./challenge-status.enum";

export interface Challenge extends Document {
  dateHourChallenge: Date;
  status: ChallengeStatus;
  dateHourApplicant: Date;
  dateHourResponse: Date;
  applicant: Player;
  category: string;
  players: Array<Player>;
  match: Match | string;
}

export interface Match extends Document {
  category: string;
  players: Array<Player>;
  def: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
