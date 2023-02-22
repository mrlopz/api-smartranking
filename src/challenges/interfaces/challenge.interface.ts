import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';

export interface Challenge extends Document {
  challengeDatetime: Date;
  status: string;
  requestDatetime: Date;
  responseDatetime: Date;
  requester: Player;
  category: string;
  players: Array<Player>;
  match: Match;
}

export interface Match extends Document {
  category: string;
  players: Array<Player>;
  def: Player;
  result: Array<MatchResult>;
}

export interface MatchResult {
  set: string;
}
