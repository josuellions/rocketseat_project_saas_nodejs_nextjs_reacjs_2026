import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";

import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-premissions";
import { UnauthorizedError } from "../_errors/error-unauthorized";
import { roleSchema } from "@saas_node_next_react/auth";
import { BadRequestError } from "../_errors/error-bad-request";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organizations/:slug/invites', {
    schema: {
      tags: ['invites'],
      summary: 'Create a new invite',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string()
      }),
      body: z.object({
        email: z.email(),
        role: roleSchema
      }),
      response: {
        201: z.object({
          result: z.object({
            inviteId: z.uuid()
          })
        })
      }
    }
  }, async (req, replay) => {
    const { slug } =  req.params;
    const { email, role } = req.body;
    const userId =  await req.getCurrentUserId();
    const { organization, membership } =  await req.getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if(cannot('create', 'Invite')) {
      throw new UnauthorizedError(`You're not allowed to create new invites.`)
    }

    const [, domain ] = email.split('@')

    if(organization.shouldAttachUsersByDomain && organization.domain === domain) {
      throw new BadRequestError(
        `Users with "${domain}" domain will join you organization automatically on login.`
      )
    }

    const inviteWothsameEmail = await prisma.invite.findUnique({
      where: {
        email_organizationId: {
          email,
          organizationId: organization.id
        }
      }
    })

    if(inviteWothsameEmail) {
      throw new BadRequestError(
        `Another invite woth same e-mail already exists.`
      )
    }

    const memberWithSameEmail = await prisma.member.findFirst({
      where: {
        organizationId: organization.id,
        user: {
          email
        }        
      }
    })

    if(memberWithSameEmail) {
      throw new BadRequestError(
        `A member with this e-mail already belongs to your organization.`
      )
    }

    const invite = await prisma.invite.create({
      data: {
        organizationId: organization.id,
        authorId: userId,
        email,
        role,
        }
    })

    return replay.status(STATUS_CODE.CREATE).send({ result: { inviteId: invite.id } })
  })
}