import { Controller, Route, Tags, Post, Body, Get } from "tsoa";
import { addFinalResults, getAllFinalResults } from "./finalResults.service.js";

// Определите интерфейс запроса, если он нужен для валидации входящих данных
export interface FinalResultsRequest {
  firstPlace: string;
  secondPlace?: string;
  thirdPlace?: string;
}

@Route("finalResults")
@Tags("FinalResults")
export class FinalResultsController extends Controller {
  /**
   * Добавить новые результаты
   * @param body Объект с данными для добавления результатов
   */
  @Post()
  public async addFinalResults(@Body() body: FinalResultsRequest): Promise<any> {
    try {
      const newResults = await addFinalResults(body);
      this.setStatus(201);
      return newResults;
    } catch (error) {
      this.setStatus(500);
      throw error;
    }
  }

  /**
   * Получить все результаты
   */
  @Get()
  public async getAllFinalResults(): Promise<any> {
    try {
      const results = await getAllFinalResults();
      return results;
    } catch (error) {
      this.setStatus(500);
      throw error;
    }
  }
}
