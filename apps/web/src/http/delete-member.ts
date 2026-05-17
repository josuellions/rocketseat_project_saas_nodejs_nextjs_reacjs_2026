import { api } from "./api-client"

interface deleteMemberRequest {
  memberId: string,
  organization: string
}

type deleteMemberResponse = never;

export async function deleteMember({ organization, memberId }: deleteMemberRequest) {
  const { result } = await api.delete(`organizations/${organization}/members/${memberId}`)
    .json<deleteMemberResponse>()

  return { result };
}