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

export async function revokeInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth)
  .post('/organizations/:slug/invites/:inviteId', {
    schema: {
      tags: ['invites'],
      summary: 'Revoke an invite',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
        inviteId: z.uuid(),
      }),
      response: {
        204: z.null()
      }
    }
  }, async (req, replay) => {
    const { slug, inviteId } =  req.params;
    const userId =  await req.getCurrentUserId();
    const { organization, membership } =  await req.getUserMembership(slug);

    const { cannot } = getUserPermissions(userId, membership.role);

    if(cannot('delete', 'Invite')) {
      throw new UnauthorizedError(`You're not allowed to delete an invites.`)
    }

    const invite = await prisma.invite.findUnique({
      where: {
        id: inviteId,
        organizationId: organization.id
      }
    })

    if(!invite) {
      throw new BadRequestError(
        `Invite not found.`
      )
    }

    await prisma.invite.delete({
      where: {
        id: inviteId        
      }
    })

    return replay.status(STATUS_CODE.NO_CONTENT).send(null)
  })
}