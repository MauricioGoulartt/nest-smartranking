import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlayerDto {
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
