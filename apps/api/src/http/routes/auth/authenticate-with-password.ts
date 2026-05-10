import z from "zod";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import STATUS_CODE from "../../../../../../types/status";
import { BadRequestError } from "../_errors/error-bad-request";
import { UnauthorizedError } from "../_errors/error-unauthorized";

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password', {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with e-mail and password',
        body: z.object({
          email: z.email(),
          password: z.string()
        }),
        response: {
          201: z.object({
            token: z.string()
          })
        }
      }
    },
    async (req, replay) => {
      const { email, password } = req.body;

      const userFromEmail = await prisma.user.findUnique({
        where: { email }
      })

      if(!userFromEmail) {
        throw new BadRequestError('Invalid credentials.')
      }

      if(userFromEmail.passwordHash === null) {
        throw new UnauthorizedError('User does not have a password, use social login')
      }

      const isPasswordValid =  await  compare(password, userFromEmail.passwordHash);

      if(!isPasswordValid) {
        throw new BadRequestError('User and password invalid credentials.');
      }

      const token = await replay.jwtSign(
        {
          sub: userFromEmail.id
        },
        {
          sign: {
            expiresIn: '7d'
          }
        }
      )

      return replay.status(STATUS_CODE.CREATE).send({ token })

    }
  )
}