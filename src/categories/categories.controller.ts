import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { CategoriesService } from "./categories.service";
import { Category } from "./interfaces/categories.interfaces";
import { UpdateCategoryDto } from "./dtos/update-category.dto";

@Controller("api/v1/categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // public methods

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Post("/:category/players/:playerId")
  @UsePipes(ValidationPipe)
  async attachPlayerCategory(@Param() params: string[]): Promise<void> {
    return await this.categoriesService.attachPlayerCategory(params);
  }

  @Put("/:_id")
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param("_id") _id: string
  ): Promise<void> {
    await this.categoriesService.updateCategory(_id, updateCategoryDto);
  }

  @Get("/:_id")
  @UsePipes(ValidationPipe)
  async findCategory(
    @Param("_id") _id: string
  ): Promise<Category[] | Category> {
    return await this.categoriesService.findCategoryById(_id);
  }

  @Get()
  async findAllCategories(): Promise<Category[] | Category> {
    return await this.categoriesService.findAllCategories();
  }

  @Delete("/:_id")
  async deleteCategory(@Param("_id") _id: string): Promise<void> {
    await this.categoriesService.deleteCategory(_id);
  }
}
