import { Role } from "@saas_node_next_react/auth";
import { api } from "./api-client"

interface getInviteResponse {
  result: {
    invite: {
      id: string,
      role: Role,
      email: string,
      createdAt: Date,
      author: {
        id: string,
        name: string | null,
        avatarUrl: string | null,
      } | null,
      organization: {
          name: string;
      },
    } | null
  }
}

export async function getInvite(inviteId: string) {
  //await new Promise((resolve) => setTimeout(resolve, 2000))

  const { result } = await api.get(`invites/${inviteId}`)
    .json<getInviteResponse>()

  return { invite: result.invite};
}