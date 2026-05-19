import Link from "next/link";
import { PlusCircleIcon } from "lucide-react";

import { ability, getCurrentOrganization } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import ProjectList from "./project-list";


export default async function Project() {
const currentOrganization = await getCurrentOrganization();
const permissions = await ability();

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold w-full">Projects</h1>

        {permissions?.can('create', 'Project') && (
          <Button size="sm" asChild>
            <Link href={`/organization/${currentOrganization}/create-project`}>
            <PlusCircleIcon className="size-4 mr-2"/>
            Create new
            </Link>
          </Button>
        )}
      </div>
      <div>
        {permissions?.can('get', 'Project') ? (
          <ProjectList/>
        ):(
          <p className="text-sm text-center text-muted-foreground w-full">
            You are not allowed to see organization projects.
          </p>
        ) }
      </div>
    </div>
  )
}