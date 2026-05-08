import { AbilityBuilder} from '@casl/ability';
import { type AppAbility } from ".";

import { userSchema, type User } from './models/user';
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
  MEMBER: (user, { can }) => {
    // can('invite', 'User'),
    can(['create', 'get'], 'Project')
    can(['update', 'delete'], 'Project', { ownerId: {$eq: user.id}})
  },
  BILLING: (_, { can} ) => {

  }
}