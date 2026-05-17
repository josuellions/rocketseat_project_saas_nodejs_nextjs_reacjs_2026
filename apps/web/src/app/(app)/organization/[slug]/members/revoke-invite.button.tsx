import { Button } from "@/components/ui/button";
import { XOctagonIcon } from "lucide-react";
import { revokeInviteAction } from "./actions";

interface RevokeInviteButtonProps {
  inviteId: string
}

export async function RevokeInviteButton({inviteId}: RevokeInviteButtonProps) {

  return (
    <form action={revokeInviteAction.bind(null, inviteId)}>
      <Button type="submit" variant="destructive" size="sm" >
        <XOctagonIcon className="size-4 mr-2"/>
        Revoke invite
      </Button>
    </form>
  )
}