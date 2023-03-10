import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CategoryEvent } from '../interfaces/category.interface';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<CategoryEvent>;
}
