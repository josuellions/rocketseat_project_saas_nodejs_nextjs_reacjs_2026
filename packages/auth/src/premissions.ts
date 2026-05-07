import { AbilityBuilder} from '@casl/ability';
import { type AppAbility } from ".";

import type { User } from './models/user';
import type { Role } from './subjects/roles';

type Roles = Role;

type PermissionsByRole = (
  user: User,
  build: AbilityBuilder<AppAbility>
) => void;

export const permissions: Record<Roles,PermissionsByRole> = {
  ADMIN: (_, { can }) => {
    can('manage', 'all')
  },
  MEMBER: (_, { can }) => {
    // can('invite', 'User'),
    can('create', 'Project')
  },
  BILLING: (_, { can} ) => {

  }
}