import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";

import { auth } from "@/http/middlewares/auth";
import STATUS_CODE  from "@/../../types/status";

export async function requestPasswordRecover(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).post('/user/password/recover', {
    schema: {
      tags: ["auth"],
      summary: "Post authenticated user recover password",
      body: z.object({
        email: z.email()
      }),
      response: {
        201: z.object({
          result: z.object({ 
            code: z.string().nullable()
          }).nullable()
        }).nullable()
      }
    }
  }, async (req, reply) => {
    const { email }  = await req.body;

    const user = await prisma.user.findUnique({
      where: { 
        email
      }
    })

    if(!user) {
     // we don't want people to know if user really exists.
     return reply.status(STATUS_CODE.CREATE).send(null)
    }

    const { id: code } = await prisma.token.create({
      data: {
        type: 'PASSWORD_RECOVER',
        userId: user.id
      }
    })
    
    // Send e-mail with password recover link

    return reply.status(STATUS_CODE.CREATE).send({ result: { code } })
  })
}