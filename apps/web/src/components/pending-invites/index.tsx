'use client'

import dayjs from 'dayjs';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CheckIcon, UserPlus2Icon, X } from "lucide-react";

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { getPendingInvites } from '@/http/get-invites-pending';
import { acceptInviteAction, rejectInviteAction } from './action';
import { queryClient } from '@/lib/react-query';

dayjs.extend(relativeTime)

export function PendingInvites() {
   
    const [isOpen, setIsOpen] = useState(false);

    const { data, refetch } = useQuery({
      queryKey: ['pending-invites'],
      queryFn: () => getPendingInvites(),
      enabled: isOpen
    })

    async function handleAcceptInvite(inviteId:string) {
      await acceptInviteAction(inviteId);

      queryClient.invalidateQueries({queryKey: ['pending-invites'] })
    }

    async function handleRejectInvite(inviteId:string) {
      await rejectInviteAction(inviteId);

      queryClient.invalidateQueries({queryKey: ['pending-invites'] })
    }

    
  return(
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button size="icon" variant="ghost" >
          <UserPlus2Icon className="size-4"/>
          <span className="sr-only">Pending invites</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-2">
        <strong className="block text-sm font-medium">Pending invites ({data?.invites.length ?? 0})</strong>

        {data?.invites.length === 0 &&(
          <p className='text-sm text-muted-foreground'>No invites found.</p>
        )}

        {data?.invites?.map(invite => (
          <div className="space-y-2" key={invite?.id}>
            <p className='text-sm leading-relaxed text-muted-foreground'> 
              <span className='font-medium text-foreground'>{invite?.author?.name ?? "Someone"}</span> invited you to join <span className='font-medium text-foreground'>{invite?.organization?.name}</span>.{' '}<br/>
              <span className='text-xs'>{dayjs(invite?.createdAt).fromNow()}</span>
            </p>
            
            <div className='flex gap-1'>
              <Button onClick={() => handleAcceptInvite(invite?.id!) } size="xs" variant="outline">
                <CheckIcon className='size-3 mr-1.5'/>
                Accept
              </Button>
              <Button onClick={() => handleRejectInvite(invite?.id!) } size="xs" variant="ghost">
                <X className='size-3 mr-1.5'/>
                Reject
              </Button>
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}