import { ability, getCurrentOrganization } from "@/auth/auth"
import { getInvites } from "@/http/get-invites";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { RevokeInviteButton } from "./revoke-invite.button";
import { CreateInviteForm } from "./create-invite-form";

export default async function Invites() {
  const currentOrganization = await getCurrentOrganization();
  const permissions = await ability();

  const { invites } = await getInvites(currentOrganization!)
  return (
    <div className="space-y-2">
      {permissions?.can('create', 'Invite') && (
        <Card>
          <CardHeader>
            <CardTitle>Invite create</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateInviteForm />
          </CardContent>
        </Card>
      )}

       <div className="space-y-2">
        <h1 className="text-lg font-semibold">Invites</h1>

        <div className="rounded border">
          <Table>
            <TableBody>
              {invites.map(invite => {
                return (
                  <TableRow key={invite.id}>
                    <TableCell className="py-2.5">
                      <span className="text-muted-foreground">{invite.email}</span>
                    </TableCell>
                    <TableCell className="py-2.5 font-medium text-center">
                      {invite.role}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex justify-end">
                        {permissions?.can('delete', 'Invite') && (
                          <RevokeInviteButton inviteId={invite.id}/>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) 
              })}

              {invites.length === 0 && (
                <TableRow>
                  <TableCell className="text-center text-muted-foreground">No invites found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}