'use client'

import { useParams } from "next/navigation";
import { queryClient } from "@/lib/react-query";
import { AlertTriangle, AsteriskIcon, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useFormState } from "@/hooks/use-form-state";
import { createProjectAction } from "./actions";

export function ProjectForm() {
  const {slug: organizationSlug } = useParams<{slug: string}>();
  const [{success, message, errors}, handleSubmit, isPending] = useFormState(
    createProjectAction,
    () => {
      queryClient.invalidateQueries({
        queryKey: [organizationSlug, 'projects']
      })
    }
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
            <AlertTitle>Save project failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input name="name" type="text" id="name" placeholder="project name"/>
          
          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
              <AsteriskIcon className="size-4"/>
              {errors.name[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea name="description" id="description" placeholder="Description project."/>

          {errors?.description && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
              <AsteriskIcon className="size-4"/>
              {errors.description[0]}
            </p>
          )}
        </div>


        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin"/>  : "Save project"}
        </Button>

      </form>
  )
}