'use server'

import { singInWithPassword } from "@/http/sing-in-with-password";

export async function signInWithEmailAndPassword(previousState: any, data: FormData) {
 
  console.log(previousState)

  const {email, password } = Object.fromEntries(data);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const result = await singInWithPassword({
    email: String(email),
    password: String(password)
  })

  console.log(result)

  return 'success';
}