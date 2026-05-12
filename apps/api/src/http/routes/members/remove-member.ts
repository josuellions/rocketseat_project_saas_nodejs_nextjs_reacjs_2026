import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";

import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-premissions";
import { UnauthorizedError } from "../_errors/error-unauthorized";

export async function removeMember(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/organizations/:slug/members/:memberId', {
    schema: {
      tags: ['members'],
      summary: 'Remove a member from the organization',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
        memberId: z.uuid(),
      }),
      response: {
        204: z.null()
      }
    }
  }, async (req, replay) => {
    const { slug, memberId } =  req.params;
    const userId =  await req.getCurrentUserId();
    const { organization, membership } =  await req.getUserMembership(slug);
    
    const { cannot } = getUserPermissions(userId, membership.role);

    if(cannot('delete', 'User')) {
      throw new UnauthorizedError(`You're not allowed to remove this member from the organization.`)
    }

    await prisma.member.delete({
      where: {
        id: memberId,
        organizationId: organization.id
      },
    })


    return replay.status(STATUS_CODE.NO_CONTENT).send(null)
  })
}