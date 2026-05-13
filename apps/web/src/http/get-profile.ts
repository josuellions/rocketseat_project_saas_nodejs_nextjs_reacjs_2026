import { api } from "./api-client"

interface getProfileResponse {
  result: {
    id: string,
    email: string | null,
    name: string,
    avatarUrl: string | null,
  }
}

export async function getProfile() {
  const { result: user } = await api.get('user/profile')
    .json<getProfileResponse>()
  
  return  { user };
}