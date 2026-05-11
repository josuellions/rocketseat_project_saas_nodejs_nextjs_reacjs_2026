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

export async function updateOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).put('/organization/:slug', {
    schema: {
      tags: ['organizations'],
      summary: 'Update organization details',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string()
      }),
      body: z.object({
        name: z.string(),
        domain: z.string().nullable(),
        shouldAttachUsersByDomain: z.boolean().optional()
      }),
      response: {
        204: z.null()
      }
    }
  }, async (req, replay) => {
    const { slug } = req.params
    const userId =  await req.getCurrentUserId();
    const { membership, organization } =  await req.getUserMembership(slug);
    const { name, domain, shouldAttachUsersByDomain } = req.body;

    const authOrganization = organizationSchema.parse({
      id: organization.id,
      ownerId: organization.ownerId
    })

    const { cannot } = getUserPermissions(userId, membership.role )

    if(cannot('update', authOrganization)) {
      throw new UnauthorizedError(`You're not allowed to update this organization.`)
    }

    if(domain) {
      const organizationByDomain = await prisma.organization.findFirst({
        where: {
          domain,
          id: {
            not: organization.id
          }
        }
      })

      if(organizationByDomain) {
        throw new BadRequestError("Another organization with same domain already exists.");
        
      }
    }

    await prisma.organization.update({
      where: {
        id: organization.id
      },
      data: {
        name,
        domain,
        shouldAttachUsersByDomain,
      }
    })

    return replay.status(STATUS_CODE.NO_CONTENT).send(null)
  })
}