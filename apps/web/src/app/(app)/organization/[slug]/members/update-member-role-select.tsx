'use client'

import type { ComponentProps } from "react";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";

import { Role } from "@saas_node_next_react/auth";
import { updateMemberRoleAction } from "./actions";

interface UpdateMemberRoleSelectProps extends ComponentProps<typeof Select> {
  memberId: string
}

export function UpdateMemberRoleSelect({memberId, ...props}: UpdateMemberRoleSelectProps) {
  
  async function updateMemberRole(role: Role) {
    await updateMemberRoleAction(memberId, role )
  }

  return (
    <Select onValueChange={updateMemberRole} {...props}>
      <SelectTrigger  className="w-32 h-8">
        <SelectValue/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="MEMBER">Member</SelectItem>
        <SelectItem value="BILLING">Billing</SelectItem>
      </SelectContent>
    </Select>
  )
}