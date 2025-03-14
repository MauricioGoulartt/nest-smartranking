import { Injectable } from "@nestjs/common";
import { CategoriesService } from "src/categories/categories.service";
import { Challenge } from "./interfaces/challenges.interfaces";
import { CreateChallengeDto } from "./dtos/create-challenge.dto";

@Injectable()
export class ChallengesService {
  constructor(private readonly categoriesService: CategoriesService) {}

  async createChallenge(
    createChallengeDto: CreateChallengeDto
  ): Promise<Challenge> {}
}
