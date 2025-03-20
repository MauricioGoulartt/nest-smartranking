import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CategoriesService } from "src/categories/categories.service";
import { Challenge, Match } from "./interfaces/challenge.interface";
import { CreateChallengeDto } from "./dtos/create-challenge.dto";
import { PlayersService } from "src/players/players.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChallengeStatus } from "./interfaces/challenge-status.enum";
import { UpdateChallengeDto } from "./dtos/update-challenge.dto";
import { AssignChallengeMatchDto } from "./dtos/attach-challenge-match.dto";

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel("Challenge") private readonly challengeModel: Model<Challenge>,
    @InjectModel("Match") private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService
  ) {}

  async createChallenge(
    createChallengeDto: CreateChallengeDto
  ): Promise<Challenge> {
    const players = await this.playersService.findAllPlayers();

    createChallengeDto.players.map((playerDto) => {
      const playerFilter = players.filter(
        (player) => player._id == playerDto._id
      );

      if (playerFilter.length > 0) {
        throw new BadRequestException(`The id ${playerDto.id} not a player!`);
      }
    });

    const applicantPlayerMatch = await createChallengeDto.players.filter(
      (player) => player._id === createChallengeDto.applicant
    );

    if (applicantPlayerMatch.length === 0) {
      throw new BadRequestException(
        `The applicant must be player of the match!`
      );
    }

    const categoryPlayer = await this.categoriesService.findPlayerCategory(
      createChallengeDto.applicant
    );

    if (!categoryPlayer) {
      throw new BadRequestException(
        `O solicitante precisa estar registrado em uma categoria!`
      );
    }

    const createdChallenge = new this.challengeModel(createChallengeDto);
    createdChallenge.category = categoryPlayer.category;
    createdChallenge.dateHourChallenge = new Date();

    createdChallenge.status = ChallengeStatus.PENDING;
    return await createdChallenge.save();
  }

  async getAllChallenges(): Promise<Array<Challenge>> {
    return await this.challengeModel
      .find()
      .populate("requester")
      .populate("players")
      .populate("match")
      .exec();
  }

  async getChallengesByPlayer(_id: any): Promise<Array<Challenge>> {
    const players = await this.playersService.findAllPlayers();
    const playerFilter = players.filter((player) => player._id == _id);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`The id ${_id} is not a player!`);
    }

    return await this.challengeModel
      .find()
      .where("players")
      .in(_id)
      .populate("requester")
      .populate("players")
      .populate("match")
      .exec();
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto
  ): Promise<void> {
    const challengeFound = await this.challengeModel.findById(_id).exec();

    if (!challengeFound) {
      throw new NotFoundException(`Challenge ${_id} not found!`);
    }

    if (updateChallengeDto.status) {
      challengeFound.dateHourResponse = new Date();
    }
    challengeFound.status = updateChallengeDto.status;
    challengeFound.dateHourChallenge = updateChallengeDto.dateHourChallenge;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challengeFound })
      .exec();
  }

  async assignChallengeMatch(
    _id: string,
    assignChallengeMatchDto: AssignChallengeMatchDto
  ): Promise<void> {
    const challengeFound = await this.challengeModel.findById(_id).exec();

    if (!challengeFound) {
      throw new BadRequestException(`Challenge ${_id} not found!`);
    }

    const playerFilter = challengeFound.players.filter(
      (player) => player._id == assignChallengeMatchDto.def
    );

    if (playerFilter.length == 0) {
      throw new BadRequestException(
        `The winning player is not part of the challenge!`
      );
    }

    const createdMatch = new this.matchModel(assignChallengeMatchDto);

    createdMatch.category = challengeFound.category;
    createdMatch.players = challengeFound.players;

    const result = await createdMatch.save();

    challengeFound.status = ChallengeStatus.COMPLETED;
    challengeFound.match = result._id as string;

    try {
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challengeFound })
        .exec();
    } catch (error) {
      await this.matchModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deleteChallenge(_id: string): Promise<void> {
    const challengeFound = await this.challengeModel.findById(_id).exec();

    if (!challengeFound) {
      throw new BadRequestException(`Challenge ${_id} not found!`);
    }

    challengeFound.status = ChallengeStatus.CANCELED;
    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challengeFound })
      .exec();
  }
}
