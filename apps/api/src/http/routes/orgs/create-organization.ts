import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { BadRequestError } from "../_errors/error-bad-request";
import { createSlug } from "@/utils/create-slug";
import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";

import { prisma } from "@/lib/prisma";

export async function createOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organization', {
    schema: {
      tags: ['organizations'],
      summary: 'Create a new organization',
      security: [{ bearerAuth: [] }],
      body: z.object({
        name: z.string(),
        domain: z.string().nullable(),
        shouldAttachUsersByDomain: z.boolean().optional()
      }),
      response: {
        201: z.object({
          result: z.object({
            organizationId: z.uuid()
          })
        })
      }
    }
  }, async (req, replay) => {
    const userId =  await req.getCurrentUserId();
    const { name, domain, shouldAttachUsersByDomain } = req.body;

    if(domain) {
      const organizationByDomain = await prisma.organization.findUnique({
        where: {
          domain
        }
      })

      if(organizationByDomain) {
        throw new BadRequestError("Another organization with same domain already exists.");
        
      }
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        domain,
        ownerId: userId,
        slug: createSlug(name),
        shouldAttachUsersByDomain,
        members: {
          create: {
            userId,
            role: 'ADMIN'
          }
        }
      }
    })

    return replay.status(STATUS_CODE.CREATE).send({ result: { organizationId: organization.id } })
  })
}