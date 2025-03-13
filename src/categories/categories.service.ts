import { BadRequestException, Injectable } from "@nestjs/common";
import { Category } from "./interfaces/categories.interfaces";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { UpdateCategoryDto } from "./dtos/update-category.dto";
import { PlayersService } from "src/players/players.service";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel("Category") private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService
  ) {}

  // public methods

  async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    const { category } = createCategoryDto;

    const existingCategory = await this.categoryModel
      .findOne({ category })
      .exec();

    if (!existingCategory) {
      return this.create(createCategoryDto);
    } else {
      throw new BadRequestException(`Category ${category} already exists!`);
    }
  }

  async updateCategory(
    _id: string,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<void> {
    const existingCategory = await this.categoryModel.findById({ _id }).exec();

    if (existingCategory) {
      this.update(_id, updateCategoryDto);
    } else {
      throw new BadRequestException(`Category not found`);
    }
  }

  async findAllCategories(): Promise<Category[]> {
    return await this.findAll();
  }

  async findCategoryById(_id: string): Promise<Category> {
    return await this.findById(_id);
  }

  async deleteCategory(_id: string): Promise<void> {
    return await this.delete(_id);
  }

  async attachPlayerCategory(params: string[]): Promise<void> {
    const category = params["category"];
    const playerId = params["playerId"];

    const categoryFound = await this.categoryModel.findById(category).exec();

    console.log(categoryFound);

    const playerRegisteredCategory = await this.categoryModel
      .findOne()
      .where("players")
      .in(playerId)
      .exec();

    const foundPlayer = await this.playersService.findPlayerById(playerId);

    if (!foundPlayer) {
      throw new BadRequestException(`The id ${playerId} is not a player!`);
    }

    if (!categoryFound) {
      throw new BadRequestException(`Category ${category} not registered!`);
    }

    if (playerRegisteredCategory) {
      throw new BadRequestException(
        `Player ${playerId} already registered in Category ${playerRegisteredCategory.category}!`
      );
    }

    categoryFound.players.push(foundPlayer);
    console.log(categoryFound);
    await this.categoryModel
      .findOneAndUpdate(
        { _id: categoryFound._id },
        { $push: { players: foundPlayer } },
        { new: true }
      )
      .exec();
  }

  // private methods

  private async create(
    createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return await createdCategory.save();
  }

  private async update(
    _id: string,
    category: UpdateCategoryDto
  ): Promise<void> {
    await this.categoryModel
      .findOneAndUpdate({ _id }, { $set: category })
      .exec();
  }

  private async findAll(): Promise<Category[]> {
    return await this.categoryModel.find().exec();
  }

  private async findById(_id: string): Promise<Category> {
    return await this.categoryModel.findById(_id).exec();
  }

  private async delete(_id: string): Promise<void> {
    await this.categoryModel.findOneAndDelete({ _id }).exec();
  }
}
