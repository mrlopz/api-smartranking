import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player') private readonly PlayerModel: Model<Player>,
  ) {}

  async persistPlayer(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDTO;

    const playerFound = await this.PlayerModel.findOne({
      email,
    }).exec();

    if (playerFound) {
      return this.update(createPlayerDTO);
    }

    return this.create(createPlayerDTO);
  }

  async getPlayers(): Promise<Player[]> {
    return await this.PlayerModel.find().exec();
  }

  async getPlayerByEmail(email: string) {
    return await this.PlayerModel.findOne({
      email,
    }).exec();
  }

  async hardDelete(email: string): Promise<Player> {
    return await this.PlayerModel.remove({ email }).exec();
  }

  private async create(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const playerCriated = new this.PlayerModel(createPlayerDTO);

    return await playerCriated.save();
  }

  private async update(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    return await this.PlayerModel.findOneAndUpdate(
      {
        email: createPlayerDTO.email,
      },
      { $set: createPlayerDTO },
    ).exec();
  }
}
