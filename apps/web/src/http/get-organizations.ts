import { api } from "./api-client"

interface getOrganizationsResponse {
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

export async function getOrganizations() {
  const { result } = await api.get('organizations',{
    next: {
      tags: ['organizations']
    }
  })
    .json<getOrganizationsResponse>()

  return {organizations: result.organizations};
}