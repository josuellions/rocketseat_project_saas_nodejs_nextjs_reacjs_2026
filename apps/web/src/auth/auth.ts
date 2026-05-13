import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getProfile } from "@/http/get-profile";

export async function isAuthenticated() {
  const cookieStore = await cookies();

  return !!cookieStore.get('token-saas-next')?.value
}

export async function auth() {
  const token = (await cookies()).get('token-saas-next')?.value;

  if(!token) {
    redirect('/auth/sign-in');
  }

  try {
    const { user } = await getProfile();

    return { user };
    
  } catch (error) {
    console.error(error);
  }

  redirect('/api/auth/sign-out');
}