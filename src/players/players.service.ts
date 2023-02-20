import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDTO;

    const playerFound = await this.playerModel.findOne({ email }).exec();

    if (playerFound) {
      throw new BadRequestException(
        `Player with email ${email} already exists!`,
      );
    }

    const playerCriated = new this.playerModel(createPlayerDTO);

    return await playerCriated.save();
  }

  async updatePlayer(
    _id: string,
    updatePlayerDTO: UpdatePlayerDTO,
  ): Promise<Player> {
    const playerFound = await this.playerModel.findOne({ _id }).exec();

    if (!playerFound) {
      throw new NotFoundException(`Player with ID ${_id} does not found!`);
    }

    return await this.playerModel
      .findOneAndUpdate(
        {
          _id,
        },
        { $set: updatePlayerDTO },
      )
      .exec();
  }

  async listPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayer(_id: string) {
    const playerFound = await this.playerModel.findOne({ _id }).exec();

    if (!playerFound) {
      throw new NotFoundException(`Player with ID ${_id} does not found!`);
    }

    return await this.playerModel
      .findOne({
        _id,
      })
      .exec();
  }

  async deletePlayer(_id: string): Promise<any> {
    return await this.playerModel.deleteOne({ _id }).exec();
  }
}
