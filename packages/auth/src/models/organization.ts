import z from "zod";

export const organizationSchema = z.object({
  __typename: z.literal('organization').default('organization'),
  id: z.string(),
  ownerId: z.string()
})

export type Organization = z.infer<typeof organizationSchema>