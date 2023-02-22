import { IsNotEmpty } from 'class-validator';
import { Player } from 'src/players/interfaces/player.interface';
import { MatchResult } from '../interfaces/challenge.interface';

export class SetChallengeMatchDTO {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Array<MatchResult>;
}
