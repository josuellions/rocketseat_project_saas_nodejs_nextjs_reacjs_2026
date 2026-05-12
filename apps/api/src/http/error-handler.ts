import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import STATUS_CODE from "../../../../types/status";
import { BadRequestError } from "./routes/_errors/error-bad-request";
import { UnauthorizedError } from "./routes/_errors/error-unauthorized";

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, _, replay) => {
  if(error instanceof ZodError) {
    return replay.status(STATUS_CODE.BAD_REQUEST).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors
    })
  }

    if(error instanceof BadRequestError) {
    return replay.status(STATUS_CODE.BAD_REQUEST).send({
      message: error.message
    })
  }

  if(error instanceof UnauthorizedError) {
    return replay.status(STATUS_CODE.UNAUTHORIZED).send({
      message: error.message
    })
  }

  console.error({"Error": error})

  // send error to some observability platform

  return replay.status(STATUS_CODE.SERVER_ERROR).send({message: 'Internal server error.'})
}