import { api } from "./api-client"

interface CreateProjectRequest {
  name: string,
  organization: string,
  description: string | null,
}

type CreateProjectResponse = void;

export async function createProject({
    name, organization, description 
  }: CreateProjectRequest): Promise<CreateProjectResponse> {
   await api.post(`organizations/${organization}/projects`, {
    json: {
      name,
      description
    }
  })
}