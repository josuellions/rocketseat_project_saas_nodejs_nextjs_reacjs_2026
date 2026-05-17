import { Role } from "@saas_node_next_react/auth";
import { api } from "./api-client"

interface getMemberResponse {
  result: {
    members: {
        id: string,
        userId: string,
        role: Role,
        name: string | null,
        avatarUrl: string | null,
        email: string,
    }[];
  }
}

interface getMemberRequest {
  organization: string
}

export async function getMembers({ organization}: getMemberRequest) {
  //await new Promise((resolve) => setTimeout(resolve, 2000))

  const { result } = await api.get(`organizations/${organization}/members`, {
    next: {
      tags: [`${organization}/members`]
    }
  })
    .json<getMemberResponse>()
  
  return { members: result.members};
}