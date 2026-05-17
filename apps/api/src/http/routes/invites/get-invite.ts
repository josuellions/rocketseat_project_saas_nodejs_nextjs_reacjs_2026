import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import STATUS_CODE from "@shared/status";

import { prisma } from "@/lib/prisma";
import { BadRequestError } from "../_errors/error-bad-request";
import { roleSchema } from "@saas_node_next_react/auth";

export async function getInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/invites/:inviteId', {
    schema: {
      tags: ['invites'],
      summary: 'Get an invite',
      params: z.object({
        inviteId: z.uuid()
      }),
      response: {
        200: z.object({
          result: z.object({
            invite: z.object({
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
          })
        })
      }
    }
  }, async (req, replay) => {
    const { inviteId } =  req.params;

    const invite = await prisma.invite.findUnique({
      where: {
        id: inviteId
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

    if(!invite) {
      throw new BadRequestError(`Invite not found!`)
    }

    return replay.status(STATUS_CODE.SUCCESS).send({ result: { invite } })
  })
}