import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";

export async function createAccount(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/users', {
    schema: {
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

    if(!userWithSameEmail) {
      return reply.status(400).send({message: 'use with same e-mail alredy exists.'})
    }

    return reply.status(200).send(userWithSameEmail)
  })
}