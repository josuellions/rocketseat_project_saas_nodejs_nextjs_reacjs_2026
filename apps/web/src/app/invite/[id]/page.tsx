import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInvite } from "@/http/get-invite"
import { Separator } from "@/components/ui/separator"
import { auth, isAuthenticated } from '@/auth/auth';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, LogInIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { acceptInvite } from '@/http/accept-invite';

interface InviteProps {
  params: {
    id: string
  }
}

dayjs.extend(relativeTime)

export default async function InvitePage({params}: InviteProps) {
  const inviteId = (await params)?.id
  const { invite } = await getInvite(inviteId);
  const isUserAuthenticated = await isAuthenticated();
  
  let currentUserEmail = null;

  if(isUserAuthenticated) {
    const { user }  = await auth();

    currentUserEmail = user.email;
  }

  const userIsAuthenticatedWithSameEmailFromInvite = currentUserEmail === invite?.email;

  async function signInFormInvite() {
    'use server'

     await (await cookies()).set('initeId', inviteId);

    redirect(`/auth/sign-in?email=${invite?.email}`)

  }

  async function acceptInviteAction() {
    'use server'

     await acceptInvite({ inviteId });

    redirect('/')

  }

  return (
    <div className="space-y-4">
      <div className="min-h-screen flex items-center justify-center flex-col px-4">
        <div className="w-full max-w-sm flex flex-col justify-center gap-4 space-y-4">
          <div className="flex flex-col items-center space-y-4 rounded-lg">
          <h1>Invite new member</h1>
          <Avatar className="size-6">
            {invite?.author?.avatarUrl && (
              <AvatarImage src={invite.author.avatarUrl}/>
            )}
            <AvatarFallback/>
          </Avatar>

          <p className='text-center leading-relaxed text-muted-foreground text-balance'> 
            <span className='font-medium text-foreground'>{invite?.author?.name ?? "Someone"}</span> invited you to join <span className='font-medium text-foreground'>{invite?.organization?.name}</span>.{' '}
            <span className='text-xs'>{dayjs(invite?.createdAt).fromNow()}</span>
          </p>
          
          <Separator/>

          {!isUserAuthenticated && (
            <form action={signInFormInvite}>
              <Button type='submit' variant="secondary" className='w-full'>
                <LogInIcon className='size-4 mr-2'/>
                Sign in to accept the invite
              </Button>
            </form>
          )}
          
          {userIsAuthenticatedWithSameEmailFromInvite && (
            <form action={acceptInviteAction}>
              <Button type='submit' variant="secondary" className='w-full'>
                <CheckCircleIcon className='size-4 mr-2'/>
                Join {invite?.organization.name}
              </Button>
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}