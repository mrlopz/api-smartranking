import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Delete, Get, Param, Put, Query } from '@nestjs/common/decorators';
import { ValidationParametersPipe } from '../common/pipes/validation-parameters.pipe';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { SetChallengeMatchDTO } from './dtos/set-challenge-match.dto';
import { UpdateChallengeDTO } from './dtos/update-challenge-dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDTO: CreateChallengeDTO,
  ): Promise<Challenge> {
    return await this.challengesService.createChallenge(createChallengeDTO);
  }

  @Post('/:challengeId/match/')
  async setChallengeMatch(
    @Body(ValidationPipe) setChallengeMatchDTO: SetChallengeMatchDTO,
    @Param('challengeId') challengeId: string,
  ): Promise<void> {
    await this.challengesService.setChallengeMatch(
      challengeId,
      setChallengeMatchDTO,
    );
  }

  @Put('/:challengeId')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) updateChallengeDTO: UpdateChallengeDTO,
    @Param('challengeId', ValidationParametersPipe) challengeId: string,
  ): Promise<void> {
    await this.challengesService.updateChallenge(
      challengeId,
      updateChallengeDTO,
    );
  }

  @Get()
  async listChallenges(
    @Query('playerId') playerId: string,
  ): Promise<Challenge[]> {
    return playerId
      ? await this.challengesService.getChallenge(playerId)
      : await this.challengesService.listChallenges();
  }

  @Delete('/:challengeId')
  async deleteChallenge(
    @Param('challengeId', ValidationParametersPipe) challengeId: string,
  ): Promise<void> {
    await this.challengesService.deleteChallenge(challengeId);
  }
}
