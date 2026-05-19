import { Role } from "@saas_node_next_react/auth";
import { api } from "./api-client"

interface getPendingInvitesResponse {
  result: {
    invites: ({
      id: string,
      role: Role,
      email: string,
      createdAt: Date,
      author: {
          name: string | null,
          id: string,
          avatarUrl: string | null,
      } | null,
      organization: {
          name: string,
      },
    } | null)[]
  }
}

export async function getPendingInvites() {
  //await new Promise((resolve) => setTimeout(resolve, 2000))

  const { result } = await api.get(`invites/pending`, {
   
  })
    .json<getPendingInvitesResponse>()
  
  return { invites: result.invites};
}