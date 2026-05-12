import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";

import { auth } from "@/http/middlewares/auth";
import STATUS_CODE  from "@/../../types/status";
import { UnauthorizedError } from "../_errors/error-unauthorized";
import { hash } from "bcryptjs";

export async function requestPasswordReset(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).post('/user/password/reset', {
    schema: {
      tags: ["auth"],
      summary: "Post authenticated user reset password",
      body: z.object({
        code: z.string(),
        password: z.string().min(6)
      }),
      response: {
        204: z.null()
      }
    }
  }, async (req, reply) => {
    const { code, password }  = await req.body;

     const token = await prisma.token.findUnique({
      where: { 
        id: code
      }
    })

    if(!token) {
      throw new UnauthorizedError();
    }

    const rounds = 6;
    const passwordHash = await hash(password, rounds);

    await prisma.$transaction([
      prisma.user.update({
        data: {
          passwordHash
        },
        where: { 
          id: token.userId
        }
      }),
      prisma.token.delete({
        where: {
          id: code
        }
      })
    ])

    return reply.status(STATUS_CODE.NO_CONTENT).send(null)
  })
}