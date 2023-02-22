import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { SetChallengeMatchDTO } from './dtos/set-challenge-match.dto';
import { UpdateChallengeDTO } from './dtos/update-challenge-dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge, Match } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match')
    private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async createChallenge(
    createChallengeDTO: CreateChallengeDTO,
  ): Promise<Challenge> {
    const players = await this.playersService.listPlayers();

    createChallengeDTO.players.forEach((playerDTO) => {
      const filteredPlayer = players.filter(
        (player) => player._id == playerDTO._id,
      );

      if (filteredPlayer.length <= 0) {
        throw new BadRequestException(
          `Player with ID ${playerDTO._id} does not found!`,
        );
      }
    });

    const requesterIsPlayerOfMatch = createChallengeDTO.players.filter(
      (player) => player._id === createChallengeDTO.requester,
    );
    if (requesterIsPlayerOfMatch.length <= 0) {
      throw new BadRequestException(`The request should be a player of match`);
    }

    this.logger.log(
      `Requester is player of match: ${requesterIsPlayerOfMatch}`,
    );

    const categoryOfPlayer = await this.categoriesService.getCategoryOfPlayer(
      createChallengeDTO.requester,
    );
    if (!categoryOfPlayer) {
      throw new BadRequestException(
        `The requester should be registered in any category`,
      );
    }

    const challengeCriated = new this.challengeModel(createChallengeDTO);

    challengeCriated.category = categoryOfPlayer.category;
    challengeCriated.requestDatetime = new Date();
    challengeCriated.status = ChallengeStatus.PENDENT;

    this.logger.log(`Challenge created: ${JSON.stringify(challengeCriated)}`);

    return await challengeCriated.save();
  }

  async updateChallenge(
    challengeId: string,
    updateChallengeDTO: UpdateChallengeDTO,
  ): Promise<Challenge> {
    const challengeFound = await this.challengeModel
      .findById(challengeId)
      .exec();
    if (!challengeFound) {
      throw new NotFoundException(`Challenge ${challengeId} does not found!`);
    }

    if (updateChallengeDTO.status) {
      challengeFound.responseDatetime = new Date();
    }

    challengeFound.status = updateChallengeDTO.status;
    challengeFound.challengeDatetime = updateChallengeDTO.challengeDatetime;

    return await this.challengeModel
      .findByIdAndUpdate(challengeId, { $set: challengeFound })
      .exec();
  }

  async listChallenges(): Promise<Challenge[]> {
    return await this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async getChallenge(playerId: string): Promise<Challenge[]> {
    const players = await this.playersService.listPlayers();

    const filteredPlayer = players.filter((player) => player._id == playerId);
    if (filteredPlayer.length == 0) {
      throw new BadRequestException(`The ${playerId} is not a player!`);
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in([playerId])
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async deleteChallenge(challengeId: string): Promise<void> {
    const challengeFound = await this.challengeModel
      .findById(challengeId)
      .exec();
    if (!challengeFound) {
      throw new BadRequestException(
        `challenge ${challengeId} is not registered!`,
      );
    }

    challengeFound.status = ChallengeStatus.CANCELED;

    await this.challengeModel
      .findByIdAndUpdate(challengeId, { $set: challengeFound })
      .exec();
  }

  async setChallengeMatch(
    challengeId: string,
    setChallengeMatchDTO: SetChallengeMatchDTO,
  ) {
    const challengeFound = await this.challengeModel
      .findById(challengeId)
      .exec();
    if (!challengeFound) {
      throw new BadRequestException(`challenge ${challengeId} does not found!`);
    }

    const filteredPlayer = challengeFound.players.filter(
      (player) => player._id == setChallengeMatchDTO.def,
    );
    if (filteredPlayer.length == 0) {
      throw new BadRequestException(
        `The victory player is not present in the challenge!`,
      );
    }

    this.logger.log(`Challenge Found: ${challengeFound}`);
    this.logger.log(`Filtered Player: ${filteredPlayer}`);

    const partidaCriada = new this.matchModel(setChallengeMatchDTO);

    partidaCriada.category = challengeFound.category;
    partidaCriada.players = challengeFound.players;

    const result = await partidaCriada.save();

    challengeFound.status = ChallengeStatus.DONE;

    try {
      return await this.challengeModel
        .findByIdAndUpdate(challengeId, { $set: challengeFound })
        .exec();
    } catch (error) {
      return await this.challengeModel.deleteOne({ _id: result._id }).exec();
    }
  }
}
