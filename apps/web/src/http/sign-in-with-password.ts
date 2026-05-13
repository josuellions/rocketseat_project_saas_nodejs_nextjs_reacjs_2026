import { api } from "./api-client"

interface SingInWithPasswordRequest {
  email: string,
  password: string
}

interface SingInWithPasswordResponse {
  token: string  
}

export async function singInWithPassword({
    email, password 
  }: SingInWithPasswordRequest) {
   const result = await api.post('sessions/password', {
    json: {
      email,
      password
    }
  }).json<SingInWithPasswordResponse>()

  return result;
}