import z from "zod";
import {
  AbilityBuilder,
  createMongoAbility,
  type CreateAbility,
  type MongoAbility,
} from "@casl/ability";

import type { User } from "./models/user";
import  { permissions } from "./premissions";
import { userSubject } from "./subjects/user";
import { projectSubject } from "./subjects/project";
import { organizationSubject } from "./subjects/organization";
import { inviteSubject } from "./subjects/invite";
import { billingSubject } from "./subjects/billing";

export * from './models/organization';
export * from './models/project';
export * from './models/user';

export * from './subjects/roles';

const appAbilitiesSchema = z.union([
  organizationSubject,
  billingSubject,
  projectSubject,
  inviteSubject,
  userSubject,
  z.tuple([
    z.literal('manage'),
    z.literal('all')
  ])
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbilility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder  = new AbilityBuilder(createAppAbilility)

  if(typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`);
    
  }

  permissions[user.role](user, builder);

  const ability = builder.build({
    detectSubjectType(subjects) {
      return subjects.__typename
    }
  })

  return ability;

}