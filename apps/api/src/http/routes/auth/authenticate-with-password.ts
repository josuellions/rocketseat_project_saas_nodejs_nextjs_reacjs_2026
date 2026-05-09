import z from "zod";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import STATUS_CODE from "../../../../../../types/status";

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password', {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with e-mail and password',
        body: z.object({
          email: z.email(),
          password: z.string()
        })
      }
    },
    async (req, replay) => {
      const { email, password } = req.body;

      const userFromEmail = await prisma.user.findUnique({
        where: { email }
      })

      if(!userFromEmail) {
        return replay.status(STATUS_CODE.BAD_REQUEST).send({message: 'Invalid credentials.'})
      }

      if(userFromEmail.passwordHash === null) {
        return replay.status(STATUS_CODE.BAD_REQUEST).send({message: 'User does not have a password, use social login'})
      }

      const isPasswordValid =  await  compare(password, userFromEmail.passwordHash);

      if(!isPasswordValid) {
        return replay.status(STATUS_CODE.UNAUTHORIZED).send({message: 'User and password invalid credentials.'});
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

      return replay.status(STATUS_CODE.SUCCESS).send({ token })

    }
  )
}