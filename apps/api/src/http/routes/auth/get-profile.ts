import { z } from "zod";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";

import STATUS_CODE  from "@/../../types/status";

export async function getUserProfile(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/user/profile', {
    schema: {
      tags: ["profile"],
      summary: "Get authenticated user profile",
      response: {
        400: z.object({
          message: z.string()
        }),
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
    const { sub } = await req.jwtVerify<{sub: string}>();

    const result = await prisma.user.findUnique({
      select:{
        id: true,
        email: true,
        name: true,
        avatarUrl: true
      },
      where: { 
        id: sub 
      }
    })

    if(!result) {
      return reply.status(STATUS_CODE.BAD_REQUEST).send({message: 'use with same e-mail alredy exists.'})
    }

    return reply.status(STATUS_CODE.SUCCESS).send({ result })
  })
}