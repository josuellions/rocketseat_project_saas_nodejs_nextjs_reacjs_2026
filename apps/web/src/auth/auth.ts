import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getProfile } from "@/http/get-profile";
import { getMembership } from "@/http/get-membership";
import { defineAbilityFor } from "@saas_node_next_react/auth";
import { env } from "@saas_node_next_react/env";

export async function isAuthenticated() {
  const cookieStore = await cookies();

  return !!cookieStore.get(env.NEXT_PUBLIC_COOKIE_TOKEN)?.value
}

export async function getCurrentOrganization() {
  const currentOrg = (await cookies()).get(env.NEXT_PUBLIC_COOKIE_ORGANIZATION)?.value ?? null;

  return currentOrg
}

export async function getCurrentMembership() {
  const organization = await getCurrentOrganization();

  if(!organization) {
    return null;
  }

  const { membership } =  await getMembership(organization);

  return membership;
}

export async function ability() {
    const membership = await getCurrentMembership();

  if(!membership) {
    return null;
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    role: membership.role
  })

  return ability
}

export async function auth() {
  const token = (await cookies()).get(env.NEXT_PUBLIC_COOKIE_TOKEN)?.value;

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