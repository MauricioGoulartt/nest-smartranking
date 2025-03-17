import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ChallengesService } from "./challenges.service";
import { CreateChallengeDto } from "./dtos/create-challenge.dto";
import { Challenge } from "./interfaces/challenges.interface";

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
  async getChallenges(): Promise<Challenge[]> {
    return await this.challengesService.getChallenges();
  }

  @Put("/:challenge")
  async updateChallenge(): Promise<void> {
    await this.challengesService.updateChallenge();
  }

  @Post()
  async attachChallangeMatch(): Promise<void> {
    await this.challengesService.attachChallenge();
  }

  @Delete("/:challenge")
  async deleteChallenges(): Promise<void> {
    await this.challengesService.deleteChallenge();
  }
}
