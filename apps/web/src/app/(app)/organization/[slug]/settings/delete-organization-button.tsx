import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { getCurrentOrganization } from "@/auth/auth";
import { deleteOrganization } from "@/http/delete-organizations";
import { redirect } from "next/navigation";

export function DeleteOrganizationButton() {
  async function deleteOrganizationAction() {
   'use server'

   const currentOrganization = await getCurrentOrganization();

   await deleteOrganization({organization: currentOrganization!})

   redirect('/')
  }

  return (
    <form action={deleteOrganizationAction}>
      <Button type="submit" variant="destructive" className="w-56">
        <XCircle className="size-4 mr-2"/>
        Excluir organization
      </Button>
    </form>
  )
}