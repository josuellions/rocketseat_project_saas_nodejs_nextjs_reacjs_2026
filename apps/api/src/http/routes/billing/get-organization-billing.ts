import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { auth } from "@/http/middlewares/auth";
import STATUS_CODE from "@shared/status";
import { getUserPermissions } from "@/utils/get-user-premissions";
import { UnauthorizedError } from "../_errors/error-unauthorized";
import { prisma } from "@/lib/prisma";

export async function getOrganizationBilling(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:slug/billing', {
    schema: {
      tags: ['billing'],
      summary: 'Get billing information from organization',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
      }),
      response: {
        200: z.object({
          result: z.object({
            billing: z.object({
              seats:  z.object({
                unit: z.number(),
                amount: z.number(),
                price: z.number(),
              }),
              projects: z.object({
                unit: z.number(),
                amount: z.number(),
                price: z.number(),
              }),
              total: z.number(),
            })
          })
        })
      }
    }
  }, async (req, replay) => {
    const { slug } = req.params;
    const userId = await req.getCurrentUserId();
    const { organization, membership } = await req.getUserMembership(slug)
   
    const { cannot } =  getUserPermissions(userId, membership.role)

    if(cannot('get', 'Billing')) {
      throw new UnauthorizedError(
        `You're not allowed to get billing details from this organization.`
      )
    }

    const [ amountOfMembers, amountOfProjects ] = await Promise.all([
      prisma.member.count({
        where: {
          organizationId: organization.id,
          role: { not: 'BILLING'}
        }
      }),

      prisma.project.count({
        where: {
          organizationId: organization.id
        }
      })
    ])

    const priceUnitMember = 10;
    const priceUnitProject = 20;

    const result = {
      billing: {
        seats: {
          unit: amountOfMembers,
          amount: amountOfMembers,
          price: amountOfMembers *  priceUnitMember
        },
        projects: {
          unit: amountOfProjects,
          amount: amountOfProjects,
          price: amountOfProjects *  priceUnitProject
        },
        total: amountOfMembers * priceUnitMember + amountOfProjects * priceUnitProject
      }
    }

    return replay.status(STATUS_CODE.SUCCESS).send({ result })
  })
}