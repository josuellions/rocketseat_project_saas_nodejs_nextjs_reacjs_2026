import { api } from "./api-client"

interface SingInWithPasswordRequest {
  code: string,
}

interface SingInWithPasswordResponse {
  token: string  
}

export async function singInWithGithub({
    code
  }: SingInWithPasswordRequest) {
   const result = await api.post('sessions/github', {
    json: {
      code
    }
  }).json<SingInWithPasswordResponse>()

  return result;
}