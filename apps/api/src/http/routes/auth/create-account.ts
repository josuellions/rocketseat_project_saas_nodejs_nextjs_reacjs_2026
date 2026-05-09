import { z } from "zod";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";

import STATUS_CODE  from "@/../../types/status";

export async function createAccount(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/users', {
    schema: {
      tags: ["auth"],
      summary: "Create a new account",
      body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)

      })
    }
  }, async (req, reply) => {
    const {name, email, password } = req.body;

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email }
    })

    if(userWithSameEmail) {
      return reply.status(STATUS_CODE.BAD_REQUEST).send({message: 'use with same e-mail alredy exists.'})
    }
    const rounds = 6;
    const passwordHash = await hash(password, rounds);

    const result = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash
      }
    })

    return reply.status(STATUS_CODE.CREATE).send({ result })
  })
}