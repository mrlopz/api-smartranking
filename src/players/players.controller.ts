import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationParametersPipe } from '../common/pipes/validation-parameters.pipe';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDTO: CreatePlayerDTO,
  ): Promise<Player> {
    return await this.playersService.createPlayer(createPlayerDTO);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDTO: UpdatePlayerDTO,
    @Param('_id', ValidationParametersPipe) _id: string,
  ): Promise<void> {
    await this.playersService.updatePlayer(_id, updatePlayerDTO);
  }

  @Get()
  async listPlayers(): Promise<Player[]> {
    return this.playersService.listPlayers();
  }

  @Get('/:_id')
  async getPlayer(
    @Param('_id', ValidationParametersPipe) _id: string,
  ): Promise<Player> {
    return this.playersService.getPlayer(_id);
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', ValidationParametersPipe) _id: string,
  ): Promise<any> {
    return this.playersService.deletePlayer(_id);
  }
}
