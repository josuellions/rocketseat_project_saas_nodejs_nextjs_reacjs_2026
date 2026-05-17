import { api } from "./api-client"

interface deleteInviteRequest {
  inviteId: string,
  organization: string
}

type deleteInviteResponse = never;

export async function deleteInvite({ organization, inviteId }: deleteInviteRequest) {
  const { result } = await api.delete(`organization/${organization}/invite/${inviteId}`)
    .json<deleteInviteResponse>()

  return { result };
}