import { ability } from "@/auth/auth"

import MemberList from "./member-list";
import Invites from "./invites";

export default async function MembersPage() {
  const premissions = await ability();

  return(
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Members</h1>
      <div className="space-y-4">
        { premissions?.can('get', 'Invite') && <Invites/> }
        { premissions?.can('get', 'User') && <MemberList/> }
      </div>
    </div>
  )
}