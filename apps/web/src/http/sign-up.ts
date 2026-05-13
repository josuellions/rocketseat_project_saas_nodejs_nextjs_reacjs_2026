import { api } from "./api-client"

interface SingUpRequest {
  name: string,
  email: string,
  password: string
}

type SingUpResponse = void;

export async function singUp({
    name, email, password 
  }: SingUpRequest): Promise<SingUpResponse> {
   await api.post('users', {
    json: {
      name,
      email,
      password
    }
  })
}