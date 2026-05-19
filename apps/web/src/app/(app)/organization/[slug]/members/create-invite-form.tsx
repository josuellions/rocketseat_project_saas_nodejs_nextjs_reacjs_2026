'use client'

import { AlertTriangle, AsteriskIcon, Loader2, UserPlus } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useFormState } from "@/hooks/use-form-state";
import { createInviteAction } from "./actions";

export function CreateInviteForm() {
  const [{success, message, errors}, handleSubmit, isPending] = useFormState(
    createInviteAction,
    // () => {
    //   queryClient.invalidateQueries({
    //     queryKey: [organizationSlug, 'projects']
    //   })
    // }
  );

  return (
      <form onSubmit={handleSubmit} className="space-y-6">

        {success  === true && message && (
          <Alert variant={"success"}>
            <AlertTriangle/>
            <AlertTitle>Successs!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        {success  === false && message && (
          <Alert variant={"destructive"}>
            <AlertTriangle/>
            <AlertTitle>Invite failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2">

          <div className="space-y-1 flex-1">
            <Input name="email" type="email" id="email" placeholder="example@email.com"/>
            
            {errors?.email && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
                <AsteriskIcon className="size-4"/>
                {errors.email[0]}
              </p>
            )}
          </div>

          <Select name="role" defaultValue="MEMBER">
            <SelectTrigger  className="w-32">
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
              <SelectItem value="BILLING">Billing</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit"  disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin"/>  : (
              <>
              <UserPlus className="size-4 mr-2"/>
              Invite user
              </>
            )}
          </Button>
        </div>



      </form>
  )
}