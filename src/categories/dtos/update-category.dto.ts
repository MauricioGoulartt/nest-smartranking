import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  readonly category: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  readonly events: Array<Event>;
}
