/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TelegramController } from './api/telegram/telegram.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MovieController } from './api/movie/movies.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FinalResultsController } from './api/finalResults/finalResults.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './api/auth/auth.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AffirmationController } from './api/affirmation/affirmation.controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "SendTelegramMessageRequest": {
        "dataType": "refObject",
        "properties": {
            "chatId": {"dataType":"string","required":true},
            "text": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserDTO": {
        "dataType": "refObject",
        "properties": {
            "telegramId": {"dataType":"string","required":true},
            "firstName": {"dataType":"string"},
            "lastName": {"dataType":"string"},
            "username": {"dataType":"string"},
            "photoUrl": {"dataType":"string"},
            "coins": {"dataType":"double"},
            "role": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["user"]},{"dataType":"enum","enums":["admin"]},{"dataType":"enum","enums":["moderator"]}]},
            "createdAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MovieDTO": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "author": {"ref":"UserDTO","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "isDeleted": {"dataType":"boolean","required":true},
            "deletedAt": {"dataType":"datetime"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FinalResultsRequest": {
        "dataType": "refObject",
        "properties": {
            "firstPlace": {"dataType":"string","required":true},
            "secondPlace": {"dataType":"string"},
            "thirdPlace": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TelegramAuthRequest": {
        "dataType": "refObject",
        "properties": {
            "initData": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateAffirmationRequest": {
        "dataType": "refObject",
        "properties": {
            "text": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsTelegramController_sendTelegramMessageHandler: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"SendTelegramMessageRequest"},
        };
        app.post('/telegram/send',
            ...(fetchMiddlewares<RequestHandler>(TelegramController)),
            ...(fetchMiddlewares<RequestHandler>(TelegramController.prototype.sendTelegramMessageHandler)),

            async function TelegramController_sendTelegramMessageHandler(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTelegramController_sendTelegramMessageHandler, request, response });

                const controller = new TelegramController();

              await templateService.apiHandler({
                methodName: 'sendTelegramMessageHandler',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMovieController_getMovies: Record<string, TsoaRoute.ParameterSchema> = {
                all: {"in":"query","name":"all","dataType":"boolean"},
        };
        app.get('/movies',
            ...(fetchMiddlewares<RequestHandler>(MovieController)),
            ...(fetchMiddlewares<RequestHandler>(MovieController.prototype.getMovies)),

            async function MovieController_getMovies(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMovieController_getMovies, request, response });

                const controller = new MovieController();

              await templateService.apiHandler({
                methodName: 'getMovies',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMovieController_getMovieById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/movies/:id',
            ...(fetchMiddlewares<RequestHandler>(MovieController)),
            ...(fetchMiddlewares<RequestHandler>(MovieController.prototype.getMovieById)),

            async function MovieController_getMovieById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMovieController_getMovieById, request, response });

                const controller = new MovieController();

              await templateService.apiHandler({
                methodName: 'getMovieById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMovieController_createMovie: Record<string, TsoaRoute.ParameterSchema> = {
                movieData: {"in":"body","name":"movieData","required":true,"dataType":"any"},
        };
        app.post('/movies',
            ...(fetchMiddlewares<RequestHandler>(MovieController)),
            ...(fetchMiddlewares<RequestHandler>(MovieController.prototype.createMovie)),

            async function MovieController_createMovie(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMovieController_createMovie, request, response });

                const controller = new MovieController();

              await templateService.apiHandler({
                methodName: 'createMovie',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMovieController_updateMovie: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                movieData: {"in":"body","name":"movieData","required":true,"dataType":"any"},
        };
        app.put('/movies/:id',
            ...(fetchMiddlewares<RequestHandler>(MovieController)),
            ...(fetchMiddlewares<RequestHandler>(MovieController.prototype.updateMovie)),

            async function MovieController_updateMovie(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMovieController_updateMovie, request, response });

                const controller = new MovieController();

              await templateService.apiHandler({
                methodName: 'updateMovie',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMovieController_softDeleteMovie: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/movies/:id',
            ...(fetchMiddlewares<RequestHandler>(MovieController)),
            ...(fetchMiddlewares<RequestHandler>(MovieController.prototype.softDeleteMovie)),

            async function MovieController_softDeleteMovie(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMovieController_softDeleteMovie, request, response });

                const controller = new MovieController();

              await templateService.apiHandler({
                methodName: 'softDeleteMovie',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMovieController_deleteMoviePermanently: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/movies/:id/permanent',
            ...(fetchMiddlewares<RequestHandler>(MovieController)),
            ...(fetchMiddlewares<RequestHandler>(MovieController.prototype.deleteMoviePermanently)),

            async function MovieController_deleteMoviePermanently(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMovieController_deleteMoviePermanently, request, response });

                const controller = new MovieController();

              await templateService.apiHandler({
                methodName: 'deleteMoviePermanently',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsFinalResultsController_addFinalResults: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"FinalResultsRequest"},
        };
        app.post('/finalResults',
            ...(fetchMiddlewares<RequestHandler>(FinalResultsController)),
            ...(fetchMiddlewares<RequestHandler>(FinalResultsController.prototype.addFinalResults)),

            async function FinalResultsController_addFinalResults(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsFinalResultsController_addFinalResults, request, response });

                const controller = new FinalResultsController();

              await templateService.apiHandler({
                methodName: 'addFinalResults',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsFinalResultsController_getAllFinalResults: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/finalResults',
            ...(fetchMiddlewares<RequestHandler>(FinalResultsController)),
            ...(fetchMiddlewares<RequestHandler>(FinalResultsController.prototype.getAllFinalResults)),

            async function FinalResultsController_getAllFinalResults(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsFinalResultsController_getAllFinalResults, request, response });

                const controller = new FinalResultsController();

              await templateService.apiHandler({
                methodName: 'getAllFinalResults',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_authenticateTelegramUser: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"TelegramAuthRequest"},
        };
        app.post('/auth/telegram',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.authenticateTelegramUser)),

            async function AuthController_authenticateTelegramUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_authenticateTelegramUser, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'authenticateTelegramUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_authenticateBrowserUser: Record<string, TsoaRoute.ParameterSchema> = {
                hash: {"in":"query","name":"hash","required":true,"dataType":"string"},
                id: {"in":"query","name":"id","required":true,"dataType":"string"},
                first_name: {"in":"query","name":"first_name","required":true,"dataType":"string"},
                last_name: {"in":"query","name":"last_name","required":true,"dataType":"string"},
                username: {"in":"query","name":"username","required":true,"dataType":"string"},
                photo_url: {"in":"query","name":"photo_url","required":true,"dataType":"string"},
                auth_date: {"in":"query","name":"auth_date","required":true,"dataType":"string"},
        };
        app.get('/auth/telegram',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.authenticateBrowserUser)),

            async function AuthController_authenticateBrowserUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_authenticateBrowserUser, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'authenticateBrowserUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAffirmationController_createAffirmation: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"CreateAffirmationRequest"},
        };
        app.post('/affirmations',
            ...(fetchMiddlewares<RequestHandler>(AffirmationController)),
            ...(fetchMiddlewares<RequestHandler>(AffirmationController.prototype.createAffirmation)),

            async function AffirmationController_createAffirmation(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAffirmationController_createAffirmation, request, response });

                const controller = new AffirmationController();

              await templateService.apiHandler({
                methodName: 'createAffirmation',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAffirmationController_getAllAffirmations: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/affirmations',
            ...(fetchMiddlewares<RequestHandler>(AffirmationController)),
            ...(fetchMiddlewares<RequestHandler>(AffirmationController.prototype.getAllAffirmations)),

            async function AffirmationController_getAllAffirmations(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAffirmationController_getAllAffirmations, request, response });

                const controller = new AffirmationController();

              await templateService.apiHandler({
                methodName: 'getAllAffirmations',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAffirmationController_getRandomAffirmation: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/affirmations/random',
            ...(fetchMiddlewares<RequestHandler>(AffirmationController)),
            ...(fetchMiddlewares<RequestHandler>(AffirmationController.prototype.getRandomAffirmation)),

            async function AffirmationController_getRandomAffirmation(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAffirmationController_getRandomAffirmation, request, response });

                const controller = new AffirmationController();

              await templateService.apiHandler({
                methodName: 'getRandomAffirmation',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAffirmationController_deleteAffirmation: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/affirmations/:id',
            ...(fetchMiddlewares<RequestHandler>(AffirmationController)),
            ...(fetchMiddlewares<RequestHandler>(AffirmationController.prototype.deleteAffirmation)),

            async function AffirmationController_deleteAffirmation(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAffirmationController_deleteAffirmation, request, response });

                const controller = new AffirmationController();

              await templateService.apiHandler({
                methodName: 'deleteAffirmation',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
