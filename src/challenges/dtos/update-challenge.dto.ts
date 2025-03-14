import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator";

export class UpdateChallengeDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  readonly events: Array<Event>;
}
