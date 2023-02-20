import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async persistPlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    await this.playersService.persistPlayer(createPlayerDTO);
  }

  @Get()
  async getPlayer(@Query('email') email: string): Promise<Player[] | Player> {
    if (email) {
      return this.playersService.getPlayerByEmail(email);
    }

    return this.playersService.getPlayers();
  }

  @Delete()
  async hardDeletePlayer(@Query('email') email: string): Promise<Player> {
    return this.playersService.hardDelete(email);
  }
}
