'use server'

import { redirect } from "next/navigation";
import { env } from "@saas_node_next_react/env";

export async function signInWithGithub() {
  const githubSignInURL = new URL('login/oauth/authorize', 'https://github.com');
  
  githubSignInURL.searchParams.set('client_id', env.GTIHUB_OAUTH_CLIENT_ID);
  githubSignInURL.searchParams.set('redirect_uri', env.GTIHUB_OAUTH_CLIENT_REDIRECT_URI);
  githubSignInURL.searchParams.set('scope', 'user');

  redirect(githubSignInURL.toString());
}