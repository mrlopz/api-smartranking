import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category-dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    const { category } = createCategoryDTO;

    const categoryFound = await this.categoryModel.findOne({ category }).exec();

    if (categoryFound) {
      throw new BadRequestException(`Category ${category} already exists!`);
    }

    const categoryCriated = new this.categoryModel(createCategoryDTO);

    return await categoryCriated.save();
  }

  async updateCategory(
    category: string,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<Category> {
    const categoryFound = await this.categoryModel.findOne({ category }).exec();

    if (!categoryFound) {
      throw new NotFoundException(`Category ${category} does not found!`);
    }

    return await this.categoryModel
      .findOneAndUpdate(
        {
          category,
        },
        { $set: updateCategoryDTO },
      )
      .exec();
  }

  async listCategories(): Promise<Category[]> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async getCategory(category: string) {
    const categoryFound = await this.categoryModel
      .findOne({ category })
      .populate('players')
      .exec();

    if (!categoryFound) {
      throw new NotFoundException(`Category ${category} does not found!`);
    }

    return await this.categoryModel
      .findOne({
        category,
      })
      .exec();
  }

  async getCategoryOfPlayer(playerId: any) {
    const players = await this.playersService.listPlayers();

    const filteredPlayers = players.filter((player) => player._id == playerId);

    if (filteredPlayers.length == 0) {
      throw new BadRequestException(
        `Player with ID ${playerId} does not found!`,
      );
    }

    return await this.categoryModel
      .findOne()
      .where('players')
      .in([playerId])
      .exec();
  }

  async deleteCategory(category: string): Promise<any> {
    return await this.categoryModel.deleteOne({ category }).exec();
  }

  async setCategoryToPlayer(params: string[]): Promise<void> {
    const category = params['category'];
    const playerId = params['playerId'];

    const categoryFound = await this.categoryModel.findOne({ category }).exec();

    if (!categoryFound) {
      throw new BadRequestException(`Category ${category} does not exist!`);
    }

    const playerAlreadyRegistered = await this.categoryModel
      .find({ category })
      .where('players')
      .in(playerId)
      .exec();

    if (playerAlreadyRegistered.length > 0) {
      throw new BadRequestException(
        `Player with ID ${playerId} is already registered in category ${category}`,
      );
    }

    await this.playersService.getPlayer(playerId);

    categoryFound.players.push(playerId);

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: categoryFound })
      .exec();
  }
}
