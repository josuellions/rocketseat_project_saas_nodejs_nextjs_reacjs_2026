import { z } from "zod";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";

import STATUS_CODE  from "@/../../types/status";
import { BadRequestError } from "../_errors/error-bad-request";

export async function createAccount(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/users', {
    schema: {
      tags: ["auth"],
      summary: "Create a new account",
      body: z.object({
        name: z.string(),
        email: z.email(),
        password: z.string().min(6)
      }),
      response: {
        201: z.object({
          result: z.object({
              id: z.string(),
              email: z.string(),
              name: z.string().nullable(),
              passwordHash: z.string().nullable()
          }).nullable()
        })
      }
    }
  }, async (req, reply) => {
    const {name, email, password } = req.body;

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email }
    })

    if(userWithSameEmail) {
      throw new BadRequestError('use with same e-mail alredy exists.')
    }

    const [, domain] =  email.split('@');

    const authJoinOrganization = await prisma.organization.findFirst({
      where: {
        domain,
        shouldAttachUsersByDomain: true
      }
    })

    const rounds = 6;
    const passwordHash = await hash(password, rounds);

    const result = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        member_on: authJoinOrganization ? {
          create: {
            organizationId: authJoinOrganization.id
          }
        }: undefined
      }
    })

    return reply.status(STATUS_CODE.CREATE).send({ result })
  })
}