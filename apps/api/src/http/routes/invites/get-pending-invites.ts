import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";

import { prisma } from "@/lib/prisma";
import { BadRequestError } from "../_errors/error-bad-request";
import { roleSchema } from "@saas_node_next_react/auth";

export async function getPendingInvites(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth)
  .get('/invites/pending', {
    schema: {
      tags: ['invites'],
      summary: 'Get all user pending an invites',
      security: [{ bearerAuth: [] }],
      response: {
        200: z.object({
          result: z.array(
            z.object({
              id: z.uuid(),
              role: roleSchema,
              email: z.email(),
              createdAt: z.date(),
              author: z.object({
                name: z.string().nullable(),
                id: z.uuid(),
                avatarUrl: z.url().nullable(),
              }).nullable(),
              organization: z.object({
                  name: z.string(),
              }),
            }).nullable()
          )
        })
      }
    }
  }, async (req, replay) => {
    const userId =  await req.getCurrentUserId();

    const  user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if(!user) {
      throw new BadRequestError(`User not found.`)
    }

    const invites = await prisma.invite.findMany({
      where: {
        email: user.email
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        },
        organization:{ 
          select: {
            name: true
          }
        }
      }
    })

   return replay.status(STATUS_CODE.SUCCESS).send({ result: invites })
  })
}