import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";

import { auth } from "@/http/middlewares/auth";
import STATUS_CODE  from "@/../../types/status";
import { BadRequestError } from "../_errors/error-bad-request";

export async function getUserProfile(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).get('/user/profile', {
    schema: {
      tags: ["auth"],
      summary: "Get authenticated user profile",
      security: [{ bearerAuth: [] }],
      response: {
        200: z.object({
          result: z.object({
              id: z.uuid(),
              email: z.email(),
              name: z.string().nullable(),
              avatarUrl: z.url().nullable()
          }).nullable()
        })
      }
    }
  }, async (req, reply) => {
    const userId  = await req.getCurrentUserId();

    const result = await prisma.user.findUnique({
      select:{
        id: true,
        email: true,
        name: true,
        avatarUrl: true
      },
      where: { 
        id: userId 
      }
    })

    if(!result) {
     throw new BadRequestError('use with same e-mail alredy exists.')
    }

    return reply.status(STATUS_CODE.SUCCESS).send({ result })
  })
}