import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Delete,
  UsePipes,
  ValidationPipe,
  Param,
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

  @Get('/:_id')
  async findPlayer(
    @Param('_id', PlayersValidationParamsPipe) _id: string,
  ): Promise<Player[] | Player> {
    return await this.playersService.findPlayerById(_id);
  }

  @Get()
  async findAllPlayers(): Promise<Player[] | Player> {
    return await this.playersService.findAllPlayers();
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', PlayersValidationParamsPipe) _id: string,
  ): Promise<void> {
    await this.playersService.deletePlayer(_id);
  }
}
