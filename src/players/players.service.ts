import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  private players: Player[] = [];
  private readonly logger = new Logger(PlayersService.name);

  async persistPlayer(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;

    const playerFound = this.players.find((player) => player.email === email);

    if (playerFound) {
      return this.update(playerFound, createPlayerDTO);
    }

    return this.create(createPlayerDTO);
  }

  async getPlayers(): Promise<Player[]> {
    return this.players;
  }

  async getPlayerByEmail(email: string) {
    return this.players.filter((player) => player.email === email);
  }

  async hardDelete(email: string) {
    const playerFound = this.players.find((player) => player.email === email);

    this.players = this.players.filter((player) => player !== playerFound);
  }

  private create(createPlayerDTO: CreatePlayerDTO): void {
    const { email, name, phoneNumber } = createPlayerDTO;

    const player: Player = {
      _id: uuidv4(),
      email,
      name,
      phoneNumber,
      imageUrl: 'www.google.com.br/foto123.jpg',
      ranking: 'A',
      rankingPosition: 1,
    };

    this.logger.log(`createPlayerDTO: ${JSON.stringify(createPlayerDTO)}`);
    this.players.push(player);
  }

  private update(playerFound: Player, createPlayerDTO: CreatePlayerDTO): void {
    const { name } = createPlayerDTO;

    playerFound.name = name;
  }
}
