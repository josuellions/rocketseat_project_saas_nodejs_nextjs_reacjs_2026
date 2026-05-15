import Link from "next/link";
import { ChevronsUpDown, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

import { getOrganization } from "@/http/get-organizations";
import { getCurrentOrganization } from "@/auth/auth";

export async function  OrganizationSwitcher() {
  const { organizations } = await getOrganization();
  const currentOrg = await getCurrentOrganization();

  const currentOrganization = organizations.find((org) => org.slug === currentOrg);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[168px] items-center gap-2 text-sm p-1 font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {currentOrganization ? (
          <>
            <Avatar className="mr-2 size-4">
              {currentOrganization.avatarUrl && <AvatarImage src={currentOrganization.avatarUrl}/>}
              <AvatarFallback/>
            </Avatar>
             <span className="line-clamp-1 text-left">{currentOrganization.name} (<span className="capitalize">{`${currentOrganization.role.toLowerCase()}`})</span></span>
          </>
        ) : (
          <span className="text-muted-foreground">Select organization</span>
        )}
        
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          {organizations.map((organization) => (
            <DropdownMenuItem key={organization.id} asChild>
             <Link href={`/organization/${organization.slug}`}>
                <Avatar className="mr-2 size-4">
                  {organization.avatarUrl && <AvatarImage src={organization.avatarUrl}/>}
                  <AvatarFallback/>
                </Avatar>
                <span className="line-clamp-1">{organization.name} (<span className="capitalize">{`${organization.role.toLowerCase()}`})</span></span>
             </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator/>
        <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <PlusCircle className="mr-2 size-4"/>
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}