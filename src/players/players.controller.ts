import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  UsePipes,
  ValidationPipe,
  Param,
  Put,
} from "@nestjs/common";

import { CreatePlayerDto } from "./dtos/create-player.dto";
import { UpdatePlayerDto } from "./dtos/update-player.dto";

import { PlayersService } from "./players.service";
import { Player } from "./interfaces/player.interface";
import { ValidationParamsPipe } from "src/common/pipes/validation-params.pipe";

@Controller("api/v1/players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPLayer(@Body() player: CreatePlayerDto): Promise<Player> {
    return await this.playersService.createPLayer(player);
  }

  @Put("/:_id")
  @UsePipes(ValidationPipe)
  async updatePLayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param("_id", ValidationParamsPipe) _id: string
  ): Promise<void> {
    await this.playersService.updatePLayer(_id, updatePlayerDto);
  }

  @Get("/:_id")
  async findPlayer(
    @Param("_id", ValidationParamsPipe) _id: string
  ): Promise<Player[] | Player> {
    return await this.playersService.findPlayerById(_id);
  }

  @Get()
  async findAllPlayers(): Promise<Player[] | Player> {
    return await this.playersService.findAllPlayers();
  }

  @Delete("/:_id")
  async deletePlayer(
    @Param("_id", ValidationParamsPipe) _id: string
  ): Promise<void> {
    await this.playersService.deletePlayer(_id);
  }
}
