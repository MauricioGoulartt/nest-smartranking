import { Controller, Post, Get, Body, Query, Delete } from '@nestjs/common';
import { PlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createUpdatePLayer(@Body() player: PlayerDto) {
    await this.playersService.createUpdatePLayer(player);
  }

  @Get()
  async findAllPlayers(
    @Query('email') email: string,
  ): Promise<Player[] | Player> {
    if (email) {
      return await this.playersService.findPlayerByEmail(email);
    }
    return await this.playersService.findAllPlayers();
  }

  @Delete()
  async deletePlayer(@Query('_id') _id: string): Promise<void> {
    await this.playersService.deletePlayer(_id);
  }
}
