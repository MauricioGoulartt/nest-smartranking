import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { CategoriesService } from "src/categories/categories.service";
import { Challenge } from "./interfaces/challenges.interface";
import { CreateChallengeDto } from "./dtos/create-challenge.dto";
import { PlayersService } from "src/players/players.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

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
    /*
  Quando um desafio for criado, definimos o status desafio como pendente
  */
    desafioCriado.status = DesafioStatus.PENDENTE;
    this.logger.log(`desafioCriado: ${JSON.stringify(desafioCriado)}`);
    return await desafioCriado.save();
  }
}
