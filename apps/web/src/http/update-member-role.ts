import { Role } from "@saas_node_next_react/auth";
import { api } from "./api-client"

interface UpdateMemberRoleRequest {
  memberId: string,
  organization: string,
  role: Role, 
}

type UpdateMemberRoleResponse = void;

export async function updateMemberRole({
   organization, memberId, role
  }: UpdateMemberRoleRequest) {
   await api.put(`organizations/${organization}/members/${memberId}`, {
    json: {
      role,
    }
  })
}