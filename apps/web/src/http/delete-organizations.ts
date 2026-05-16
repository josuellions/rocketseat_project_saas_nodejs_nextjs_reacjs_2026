import { api } from "./api-client"

interface deleteOrganizationRequest {
  organization: string
}

type deleteOrganizationResponse = never;

export async function deleteOrganization({ organization }: deleteOrganizationRequest) {
  const { result } = await api.delete(`organization/${organization}`)
    .json<deleteOrganizationResponse>()

  return { result };
}