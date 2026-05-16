import { api } from "./api-client"

interface getProjectResponse {
  result: {
    projects: {
      name: string,
      id: string,
      ownerId: string,
      slug: string,
      avatarUrl: string | null,
      createdAt: string,
      organizationId: string,
      description: string,
      owner: {
          name: string | null,
          id: string,
          avatarUrl: string | null,
      };
    }[]
  }
}

export async function getProjects(slug: string) {
  //await new Promise((resolve) => setTimeout(resolve, 2000))

  const { result } = await api.get(`organizations/${slug}/projects`)
    .json<getProjectResponse>()
  
  return { projects: result.projects};
}