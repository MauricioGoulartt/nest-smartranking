import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ChallengesService } from "./challenges.service";
import { CreateChallengeDto } from "./dtos/create-challenge.dto";
import { Challenge } from "./interfaces/challenge.interface";
import { ChallengeStatusValidationPipe } from "./pipes/challenge-status-validation.pipe";
import { UpdateChallengeDto } from "./dtos/update-challenge.dto";
import { AssignChallengeMatchDto } from "./dtos/attach-challenge-match.dto";

@Controller("api/v1/challenges")
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto
  ): Promise<Challenge> {
    return await this.challengesService.createChallenge(createChallengeDto);
  }

  @Get()
  async getChallenges(@Query("idPlayer") _id: string): Promise<Challenge[]> {
    return await this.challengesService.getChallengesByPlayer(_id);
  }

  @Put("/:challenge")
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
    @Param("challenge") _id: string
  ): Promise<void> {
    await this.challengesService.updateChallenge(_id, updateChallengeDto);
  }

  @Post("/:challenge/match/")
  async attachChallangeMatch(
    @Body(ValidationPipe) assignChallengeMatchDto: AssignChallengeMatchDto,
    @Param("challenge") _id: string
  ): Promise<void> {
    await this.challengesService.assignChallengeMatch(
      _id,
      assignChallengeMatchDto
    );
  }

  @Delete("/:challenge")
  async deleteChallenges(@Param("_id") _id: string): Promise<void> {
    await this.challengesService.deleteChallenge(_id);
  }
}
