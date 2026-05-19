import { api } from "./api-client"

interface UpdateOrganizationRequest {
  name: string,
  domain: string | null,
  organization: string, 
  shouldAttachUsersByDomain: boolean
}

type UpdateOrganizationResponse = void;

export async function updateOrganization({
    name, domain, organization, shouldAttachUsersByDomain 
  }: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
   await api.put(`organization/${organization}`, {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain
    }
  })
}