import { Controller, Route, Tags, Post, Get, Delete, Body, Path } from "tsoa";
import {
  createAffirmation,
  getAllAffirmations,
  getRandomAffirmation,
  deleteAffirmation,
} from "./affirmation.service.js";
import { AffirmationDTO } from "./../../../models/Affirmation.js";

interface CreateAffirmationRequest {
  text: string;
}

@Route("affirmations")
@Tags("Affirmations")
export class AffirmationController extends Controller {
  /**
   * Добавить новую аффирмацию
   */
  @Post()
  public async createAffirmation(@Body() request: CreateAffirmationRequest): Promise<any> {
    try {
      if (!request.text) {
        this.setStatus(400);
        return { error: "Text is required" };
      }

      const newAffirmation = await createAffirmation(request.text);
      this.setStatus(201);
      return newAffirmation;
    } catch (error) {
      this.setStatus(500);
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * Получить все аффирмации
   */
  @Get()
  public async getAllAffirmations(): Promise<AffirmationDTO[]> {
    try {
      const affirmations: AffirmationDTO[] = await getAllAffirmations();
      return affirmations;
    } catch (error) {
      this.setStatus(500);
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * Получить случайную аффирмацию
   */
  @Get("random")
  public async getRandomAffirmation(): Promise<any> {
    try {
      const randomAffirmation = await getRandomAffirmation();
      if (!randomAffirmation) {
        this.setStatus(404);
        return { error: "No affirmations found" };
      }
      return randomAffirmation;
    } catch (error) {
      this.setStatus(500);
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * Удалить аффирмацию по ID
   */
  @Delete("{id}")
  public async deleteAffirmation(@Path() id: string): Promise<any> {
    try {
      const deletedAffirmation = await deleteAffirmation(id);
      if (!deletedAffirmation) {
        this.setStatus(404);
        return { error: "Affirmation not found" };
      }
      return { message: "Affirmation deleted", deletedAffirmation };
    } catch (error) {
      this.setStatus(500);
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }
}
