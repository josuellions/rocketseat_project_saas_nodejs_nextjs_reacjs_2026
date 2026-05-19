import Image from "next/image"
import { ArrowLeftRightIcon, Crown, UserMinusIcon } from "lucide-react"

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { getMembers } from "@/http/get-members"
import { getMembership } from "@/http/get-membership"
import { getOrganization } from "@/http/get-organization"
import { ability, getCurrentOrganization } from "@/auth/auth"

import { UpdateMemberRoleSelect } from "./update-member-role-select"
import { organizationSchema } from "@saas_node_next_react/auth"
import { deleteMemberAction } from "./actions"

export default async function MemberList() {
  const premissions = await ability();
  const currentOrganization = await getCurrentOrganization();
  const [{ membership }, { members }, { organization }] = await Promise.all([
    getMembership(currentOrganization!),
    getMembers({organization: currentOrganization!}),
    getOrganization({organization: currentOrganization!})
  ]);

  const authOrganization = organizationSchema.parse(organization);

  return (
    <div className="space-y-2">
      <h1 className="text-lg font-semibold">Members</h1>

      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map(member => {
              return (
                <TableRow >
                  <TableCell className="py-2.5" style={{width: 48}}>
                    <Avatar>
                      <AvatarFallback />
                      {member.avatarUrl && (
                        <Image src={member.avatarUrl} width={32} height={32} alt="avatar member" 
                          className="aspect-square size-full rounded-full"
                        />
                      )} 
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex flex-col">
                      <span className="inline-flex items-center gap-2 font-medium">
                        {member.name}
                        {membership.userId === member.userId && ' (me) '}
                        {organization.ownerId === member.userId && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Crown className="size-3"/>
                            Owner
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">{member.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      {premissions?.can('transfer_ownership', authOrganization) && 
                        <Button variant="ghost" size="sm" className="text-sm">
                          <ArrowLeftRightIcon className="size-4 mr-2"/>
                          Transfer ownership
                        </Button> 
                      }

                      {premissions?.can('update', 'User') && 
                       <UpdateMemberRoleSelect 
                        memberId={member.id}
                        value={member.role}
                        disabled={
                          membership.userId === member.userId || organization.ownerId === member.userId
                        }
                       />
                      }

                      {/* <form action={deleteMemberAction.bind(null, member.id)}> */}
                      {premissions?.can('delete', 'User') && 
                        <form action={ async () => {
                          'use server'
                          await deleteMemberAction(member.id)
                        }}
                        >
                          <Button type="submit" variant="destructive" size="sm" className="text-sm"
                            disabled={membership.userId === member.userId || organization.ownerId === member.userId}
                          >
                            <UserMinusIcon className="size-4 mr-2"/>
                            Remove
                          </Button>  
                       </form>
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ) 
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}