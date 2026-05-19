'use client'

import { AlertTriangle, AsteriskIcon, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { useFormState } from "@/hooks/use-form-state";
import { createOrganizationAction, updateOrganizationAction, type OrganizationSchema } from "./actions";

interface OrganizationFormProps {
  isUpdate?: boolean,
  initialData?: OrganizationSchema
}

export function OrganizationForm({isUpdate, initialData}: OrganizationFormProps) {
  const formAction = isUpdate ? updateOrganizationAction : createOrganizationAction;
  const [{success, message, errors}, handleSubmit, isPending] = useFormState(formAction);

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
            <AlertTitle>Save organization failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input name="name" type="text" id="name" defaultValue={initialData?.name} placeholder="organization name"/>
          
          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
              <AsteriskIcon className="size-4"/>
              {errors.name[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="domain">Domain</Label>
          <Input name="domain" type="text" id="domain" inputMode="url" defaultValue={initialData?.domain ?? undefined} placeholder="example.com"/>

          {errors?.domain && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
              <AsteriskIcon className="size-4"/>
              {errors.domain[0]}
            </p>
          )}
        </div>

          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <Checkbox
                defaultChecked={initialData?.shouldAttachUsersByDomain}
                name="shouldAttachUsersByDomain"
                id="shouldAttachUsersByDomain"
                className="translate-y-0.5"
              />
              <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
                <span className="text-sm font-medium leading-none">Auto-join new members</span>
                <p className="text-sm text-muted-foreground">This will authomatically invite all members with same e-mail domain to this organization.</p>
              </label>
            </div>

          {errors?.shouldAttachUsersByDomain && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
              <AsteriskIcon className="size-4"/>
              {errors.shouldAttachUsersByDomain[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin"/>  : "Save organization"}
        </Button>

      </form>
  )
}