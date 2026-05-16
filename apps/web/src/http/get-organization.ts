import { api } from "./api-client"

interface getOrganizationResponse {
  result: {
    organization: {
      id: string,
      name: string,
      ownerId: string,
      slug: string,
      domain: string | null,
      shouldAttachUsersByDomain: boolean,
      avatarUrl: string | null,
      createdAt: string,
      updatedAt: string,
    }
  }
}

interface getOrganizationRequest {
  organization: string
}

export async function getOrganization({organization}: getOrganizationRequest) {
  const { result } = await api.get(`organizations/${organization}`)
    .json<getOrganizationResponse>()

  return {organization: result.organization};
}