import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/jogador.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePLayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    this.logger.log(`createPlayerDto: ${JSON.stringify(createPlayerDto)}`);

    this.create(createPlayerDto);
  }

  private create(createPlayerDto: CreatePlayerDto): void {
    const { name, email, phoneNumber } = createPlayerDto;

    const player: Player = {
      _id: uuid(),
      name,
      email,
      phoneNumber,
      ranking: 'A',
      positionRanking: 1,
      urlAvatar: 'https://www.google.com.br/',
    };
    this.players.push(player);
  }

  async findAll(): Promise<Player[]> {
    return this.players;
  }

  async findById(_id: string): Promise<Player> {
    return this.players.find((player) => player._id === _id);
  }
}
