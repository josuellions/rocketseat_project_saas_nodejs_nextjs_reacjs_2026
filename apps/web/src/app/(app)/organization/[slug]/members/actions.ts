'use server'

import z from "zod";
import { HTTPError } from "ky";
import { revalidateTag } from "next/cache";

import { type Role, roleSchema } from "@saas_node_next_react/auth";
import { getCurrentOrganization } from "@/auth/auth"

import { updateMemberRole } from "@/http/update-member-role";
import { deleteMember } from "@/http/delete-member";
import { createInvite } from "@/http/create-invite";
import { deleteInvite } from "@/http/delete-invite";

const inviteSchema = z.object({
  email: z.email({message: 'Invalid e-mail address.'}),
  role: roleSchema,
})

export async function deleteMemberAction(memberId: string) {
  const currentOrganization = await getCurrentOrganization();

  await deleteMember({
    organization: currentOrganization!,
    memberId: memberId
  });

  revalidateTag(`${currentOrganization}/members`)
}

export async function updateMemberRoleAction(memberId: string, role: Role) {
  const currentOrganization = await getCurrentOrganization();

  await updateMemberRole({
    organization: currentOrganization!,
    memberId: memberId,
    role
  });

  revalidateTag(`${currentOrganization}/members`)
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrganization = await getCurrentOrganization();

  await deleteInvite({
    organization: currentOrganization!,
    inviteId: inviteId,
  });

  revalidateTag(`${currentOrganization}/invites`)
}

export async function createInviteAction( data: FormData) {
 
  const result = inviteSchema.safeParse(Object.fromEntries(data));

  if(!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors}
  }

  const { email, role } = result.data;

  //await new Promise((resolve) => setTimeout(resolve, 2000));
  const getOrganization = await getCurrentOrganization()
  
  try {
    await createInvite({
      email,
      role,
      organization: getOrganization!
    })
  
    revalidateTag(`${getOrganization}/invites`);

  } catch (err) {
    if(err instanceof HTTPError) {
      const { message } = await err.response.json();
      
      return {success: false, message, errors: null};  
    }
    console.error(err);

    return {success: false, message: 'Unexpected error, try again in a few minutes.', errors: null};  
  }

  return {success: true, message: "Successfully create the invite.", errors: null};
}
