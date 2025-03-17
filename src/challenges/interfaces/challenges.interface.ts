import { Document } from "mongoose";
import { Player } from "src/players/interfaces/player.interface";

export interface Challenge extends Document {
  dateHourChallenge: Date;
  status: MatchStatus;
  dateHourApplicant: Date;
  dateHourResponse: Date;
  applicant: Player;
  category: string;
  players: Array<Player>;
  match: Match;
}

export interface Match extends Document {
  cacategoryegoria: string;
  jogadores: Array<Player>;
  def: Player;
  resultado: Array<Result>;
}

export interface Result {
  set: string;
}
