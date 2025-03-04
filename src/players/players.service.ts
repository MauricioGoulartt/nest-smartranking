import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  // public methods

  async createPLayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;
    const existingPlayer = await this.playerModel.findOne({ email }).exec();

    if (!existingPlayer) {
      return this.create(createPlayerDto);
    } else {
      throw new BadRequestException(
        `Player already exists with the email ${createPlayerDto.email}`,
      );
    }
  }

  async updatePLayer(
    _id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    const existingPlayer = await this.playerModel.findById({ _id }).exec();

    if (existingPlayer) {
      existingPlayer.name = updatePlayerDto.name;

      this.update(_id, existingPlayer);
    } else {
      throw new BadRequestException(`Player not found`);
    }
  }

  async findAllPlayers(): Promise<Player[]> {
    return await this.findAll();
  }

  async findPlayerById(_id: string): Promise<Player> {
    return await this.findById(_id);
  }

  async deletePlayer(_id: string): Promise<void> {
    return await this.delete(_id);
  }

  // private methods

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel(createPlayerDto);
    return await createdPlayer.save();
  }

  private async update(_id: string, player: UpdatePlayerDto): Promise<void> {
    await this.playerModel.findOneAndUpdate({ _id }, { $set: player }).exec();
  }

  private async findAll(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  private async findById(_id: string): Promise<Player> {
    return await this.playerModel.findById(_id).exec();
  }

  private async delete(_id: string): Promise<void> {
    await this.playerModel.findOneAndDelete({ _id }).exec();
  }
}
