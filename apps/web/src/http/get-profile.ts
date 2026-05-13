import { api } from "./api-client"

interface getProfileResponse {
  user: {
    id: string,
    email: string | null,
    name: string,
    avatarUrl: string | null,
  }
}

export async function getProfile() {
  const result = await api.get('user/profile')
    .json<getProfileResponse>()

  return { user:  result  };
}