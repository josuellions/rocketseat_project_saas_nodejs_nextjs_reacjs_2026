'use server'

import { singInWithPassword } from "@/http/sing-in-with-password";

export async function signInWithEmailAndPassword(data: FormData) {
 
  const {email, password } = Object.fromEntries(data);

  const result = await singInWithPassword({
    email: String(email),
    password: String(password)
  })

  console.log(result)
}