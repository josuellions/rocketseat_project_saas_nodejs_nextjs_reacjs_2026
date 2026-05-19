import { Role } from "@saas_node_next_react/auth";
import { api } from "./api-client"

interface getInvitesResponse {
  result: {
    invites: {
      id: string,
      role: Role,
      email: string,
      createdAt: Date,
      author: {
        id: string,
        name: string | null,
      } | null,
    }[]
  }
}

export async function getInvites(organization: string) {
  //await new Promise((resolve) => setTimeout(resolve, 2000))

  const { result } = await api.get(`organizations/${organization}/invites`, {
    next: {
      tags: [`${organization}/invites`]
    }
  })
    .json<getInvitesResponse>()
  
  return { invites: result.invites};
}