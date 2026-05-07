import { AbilityBuilder} from '@casl/ability';
import { type AppAbility } from ".";

import type { User } from './models/user';

type Roles = 'ADMIN' | 'MEMBER'

type PermissionsByRole = (
  user: User,
  build: AbilityBuilder<AppAbility>
) => void;

export const permissions: Record<Roles,PermissionsByRole> = {
  ADMIN: (_, { can }) => {
    can('manage', 'User')
  },
  MEMBER: (_, { can }) => {
    can('invite', 'User')
  }
}