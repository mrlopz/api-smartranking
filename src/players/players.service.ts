import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player') private readonly PlayerModel: Model<Player>,
  ) {}

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDTO;

    const playerFound = await this.PlayerModel.findOne({ email }).exec();

    if (playerFound) {
      throw new BadRequestException(`Player already exists!`);
    }

    const playerCriated = new this.PlayerModel(createPlayerDTO);

    return await playerCriated.save();
  }

  async updatePlayer(
    _id: string,
    updatePlayerDTO: UpdatePlayerDTO,
  ): Promise<Player> {
    const playerFound = await this.PlayerModel.findOne({ _id }).exec();

    if (!playerFound) {
      throw new NotFoundException(`Player ${_id} does not found!`);
    }

    return await this.PlayerModel.findOneAndUpdate(
      {
        _id,
      },
      { $set: updatePlayerDTO },
    ).exec();
  }

  async listPlayers(): Promise<Player[]> {
    return await this.PlayerModel.find().exec();
  }

  async getPlayer(_id: string) {
    const playerFound = await this.PlayerModel.findOne({ _id }).exec();

    if (!playerFound) {
      throw new NotFoundException(`Player ${_id} does not found!`);
    }

    return await this.PlayerModel.findOne({
      _id,
    }).exec();
  }

  async deletePlayer(_id: string): Promise<any> {
    return await this.PlayerModel.deleteOne({ _id }).exec();
  }
}
