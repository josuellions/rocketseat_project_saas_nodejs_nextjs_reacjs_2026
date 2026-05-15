import { Role } from '@saas_node_next_react/auth';
import { api } from "./api-client"


interface getMembershipResponse {
  result: {
    membership: {
      id: string,
      role: Role,
      userId: string,
      organizationId: string,
    }
  }
}

export async function getMembership(slug: string) {
  const { result } = await api.get(`organizations/${slug}/membership`)
    .json<getMembershipResponse>()
  
  return  { membership: result.membership };
}