'use server'

import { z } from "zod";
import { HTTPError } from "ky";
import { cookies } from "next/headers";

import { singInWithPassword } from "@/http/sing-in-with-password";

const signInschema = z.object({
  email: z.email({message: 'Please, provide a valid e-mail address.'}),
  password: z.string().min(6, {message: 'Please, provide your password.'})
})

// export async function signInWithEmailAndPassword(previousState: any, data: FormData) {
export async function signInWithEmailAndPassword( data: FormData) {
 
  const result = signInschema.safeParse(Object.fromEntries(data));

  if(!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors}
  }

  const { email, password } = result.data;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const cookieStore = await cookies();
    const { token } = await singInWithPassword({
      email,
      password
    })

    cookieStore.set('token-saas-next', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

  } catch (err) {
    if(err instanceof HTTPError) {
      const { message } = await err.response.json();
      
      return {success: false, message, errors: null};  
    }
    console.error(err);

    return {success: false, message: 'Unexpected error, try again in a few minutes.', errors: null};  
  }

  return {success: true, message: null, errors: null};
}