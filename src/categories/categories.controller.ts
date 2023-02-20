import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Delete, Get, Param, Put } from '@nestjs/common/decorators';
import { ValidationParametersPipe } from '../common/pipes/validation-parameters.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category-dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDTO);
  }

  @Put('/:category')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @Param('category', ValidationParametersPipe) category: string,
  ) {
    await this.categoriesService.updateCategory(category, updateCategoryDTO);
  }

  @Get()
  async listCategories(): Promise<Category[]> {
    return await this.categoriesService.listCategories();
  }

  @Get('/:category')
  async getCategory(
    @Param('category', ValidationParametersPipe) category: string,
  ): Promise<Category> {
    return this.categoriesService.getCategory(category);
  }

  @Delete('/:category')
  async deleteCategory(
    @Param('category', ValidationParametersPipe) category: string,
  ): Promise<any> {
    return this.categoriesService.deleteCategory(category);
  }

  @Post('/:category/players/:playerId')
  async setCategoryToPlayer(@Param() params: string[]): Promise<void> {
    return await this.categoriesService.setCategoryToPlayer(params);
  }
}
