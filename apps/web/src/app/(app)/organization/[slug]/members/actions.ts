'use server'

import { deleteMember } from "@/http/delete-member";
import { updateMemberRole } from "@/http/update-member-role";
import { getCurrentOrganization } from "@/auth/auth"
import { Role } from "@saas_node_next_react/auth";

import { revalidateTag } from "next/cache";

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