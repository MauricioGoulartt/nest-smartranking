import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';
import { PlayersValidationParamsPipe } from './pipes/players-validation-params.pipe';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createUpdatePLayer(@Body() player: PlayerDto) {
    await this.playersService.createUpdatePLayer(player);
  }

  @Get()
  async findAllPlayers(
    @Query('email', PlayersValidationParamsPipe) email: string,
  ): Promise<Player[] | Player> {
    if (email) {
      return await this.playersService.findPlayerByEmail(email);
    }
    return await this.playersService.findAllPlayers();
  }

  @Delete()
  async deletePlayer(
    @Query('email', PlayersValidationParamsPipe) email: string,
  ): Promise<void> {
    await this.playersService.deletePlayer(email);
  }
}
