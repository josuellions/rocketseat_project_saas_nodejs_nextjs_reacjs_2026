import { api } from "./api-client"

interface getOrganizationResponse {
  result: {
    organizations: {
      id: string,
      name: string,
      slug: string,
      avatarUrl: string | null,
      role: string
    }[]
  }
}

export async function getOrganization() {
  const { result } = await api.get('organizations')
    .json<getOrganizationResponse>()

  return {organizations: result.organizations};
}