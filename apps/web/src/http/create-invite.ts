import { Role } from "@saas_node_next_react/auth";
import { api } from "./api-client"

interface CreateInviteRequest {
  email: string | null,
  organization: string,
  role: Role
}

type CreateInviteResponse = void;

export async function createInvite({
   email, role, organization
  }: CreateInviteRequest): Promise<CreateInviteResponse> {
   await api.post(`organizations/${organization}/invites`, {
    json: {
      email,
      role
    }
  })
}