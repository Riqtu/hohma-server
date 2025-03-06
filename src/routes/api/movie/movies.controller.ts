import { Controller, Get, Route, Tags, Path, Post, Put, Delete, Body, Query } from "tsoa";
import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  softDeleteMovie,
  deleteMoviePermanently,
} from "./movies.service.js";
import { MovieDTO } from "../../../models/Movie.js";

@Route("movies")
@Tags("Movies")
export class MovieController extends Controller {
  /** Получить список всех фильмов */
  @Get("/")
  public async getMovies(@Query() all?: boolean): Promise<MovieDTO[]> {
    return await getMovies(all === true);
  }

  /** Получить фильм по ID */
  @Get("/{id}")
  public async getMovieById(@Path() id: string): Promise<MovieDTO | null> {
    return await getMovieById(id);
  }

  /** Создать новый фильм */
  @Post("/")
  public async createMovie(@Body() movieData: any): Promise<MovieDTO> {
    return await createMovie(movieData);
  }

  /** Обновить информацию о фильме */
  @Put("/{id}")
  public async updateMovie(@Path() id: string, @Body() movieData: any): Promise<MovieDTO | null> {
    return await updateMovie(id, movieData);
  }

  /** Мягкое удаление фильма */
  @Delete("/{id}")
  public async softDeleteMovie(@Path() id: string): Promise<{ message: string }> {
    const movie = await softDeleteMovie(id);
    if (!movie) {
      this.setStatus(404);
      return { message: "Movie not found" };
    }
    return { message: "Movie marked as deleted" };
  }

  /** Полное удаление фильма */
  @Delete("/{id}/permanent")
  public async deleteMoviePermanently(@Path() id: string): Promise<{ message: string }> {
    const movie = await deleteMoviePermanently(id);
    if (!movie) {
      this.setStatus(404);
      return { message: "Movie not found" };
    }
    return { message: "Movie permanently deleted" };
  }
}
