import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { organizationSchema  } from "@saas_node_next_react/auth";
import { BadRequestError } from "../_errors/error-bad-request";
import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";

import { prisma } from "@/lib/prisma";
import { UnauthorizedError } from "../_errors/error-unauthorized";
import { getUserPermissions } from "@/utils/get-user-premissions";

export async function transferOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).patch('/organization/:slug/owner', {
    schema: {
      tags: ['organizations'],
      summary: 'Transfer organization ownership',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string()
      }),
      body: z.object({
        transferToUserId: z.uuid(),
      }),
      response: {
        204: z.null()
      }
    }
  }, async (req, replay) => {
    const { slug } = req.params
    const userId =  await req.getCurrentUserId();
    const { membership, organization } =  await req.getUserMembership(slug);
    const { transferToUserId } = req.body;

    const authOrganization = organizationSchema.parse({
      id: organization.id,
      ownerId: organization.ownerId
    })

    const { cannot } = getUserPermissions(userId, membership.role )

    if(cannot('transfer_ownership', authOrganization)) {
      throw new UnauthorizedError(`You're not allowed to transfer this organization ownership.`)
    }

    const transferToMembership = await prisma.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: transferToUserId
        }
      }
    })

    if(!transferToMembership) {
      throw new BadRequestError("Target user is not a member of this organization.");
      
    }

    await prisma.$transaction([
      prisma.member.update({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: transferToUserId
        }
      },
      data: {
        role: 'ADMIN'
      }
      }),

      prisma.organization.update({
        where: {
          id: organization.id
        },
        data: {
          ownerId: transferToUserId
        }
      })
    ])

    return replay.status(STATUS_CODE.NO_CONTENT).send(null)
  })
}