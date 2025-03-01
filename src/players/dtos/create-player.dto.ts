import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PlayerDto {
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
