import { Injectable, Logger, NotFoundException, Query } from '@nestjs/common';
import { PlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/jogador.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  async createUpdatePLayer(player: PlayerDto): Promise<void> {
    const { email } = player;

    const existingPlayer = await this.findByEmail(email);

    if (existingPlayer) {
      existingPlayer.name = player.name;

      this.update(existingPlayer, player);
    } else {
      this.create(player);
    }
  }

  async findAllPlayers(): Promise<Player[]> {
    return await this.findAll();
  }

  async findPlayerByEmail(@Query('email') email: string): Promise<Player> {
    return await this.findByEmail(email);
  }

  async deletePlayer(_id: string): Promise<void> {
    const player = this.players.find((player) => player._id === _id);

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    this.delete(_id);
  }

  private create(player: PlayerDto): void {
    const { name, email, phoneNumber } = player;

    const l_player: Player = {
      _id: uuid(),
      name,
      email,
      phoneNumber,
      ranking: 'A',
      positionRanking: 1,
      urlAvatar: 'https://www.google.com.br/',
    };
    this.players.push(l_player);
  }

  private update(existingPlayer: Player, player: PlayerDto): void {
    const { name } = player;

    existingPlayer.name = name;

    this.players = this.players.map((p) =>
      p._id === existingPlayer._id ? existingPlayer : p,
    );
  }

  private async findAll(): Promise<Player[]> {
    return this.players;
  }

  private async findByEmail(email: string): Promise<Player> {
    const findedPlayer = this.players.find((player) => player.email === email);

    if (!findedPlayer) {
      return null;
    }

    return findedPlayer;
  }

  private delete(_id: string): void {
    this.players = this.players.filter((player) => player._id !== _id);
  }
}
