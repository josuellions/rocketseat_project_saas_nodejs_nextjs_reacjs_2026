import { Button } from "./ui/button";
import { NavLink } from "./nav-link";

import { ability, getCurrentOrganization } from "@/auth/auth";

export default async function  Tabs() {
  const currentOrganization = await getCurrentOrganization();
  const permissions = await ability();

  const canUpdateOrganization = permissions?.can('update', 'Organization');
  const canGetProjects = permissions?.can('get', 'Project');
  const canGetBilling = permissions?.can('get', 'Billing');
  const canGetMembers = permissions?.can('get', 'User');

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-[1200px] items-center gap-2">
        {canGetProjects && (
          <Button asChild variant="ghost" size={"sm"} className="text-muted-foreground border border-none data-[current=true]:text-foreground data-[current=true]:border-border data-[current=true]:border-solid">
            <NavLink href={`/organization/${currentOrganization}`}>
              Projects
            </NavLink>
          </Button>
        )}
        
        {canGetMembers && (
          <Button asChild variant="ghost" size={"sm"} className="text-muted-foreground border border-none data-[current=true]:text-foreground data-[current=true]:border-border data-[current=true]:border-solid">
            <NavLink href={`/organization/${currentOrganization}/members`}>
              Members
            </NavLink>
          </Button>
        )}

        {( canUpdateOrganization || canGetBilling) && (
          <Button asChild variant="ghost" size={"sm"} className="text-muted-foreground border border-none data-[current=true]:text-foreground data-[current=true]:border-border data-[current=true]:border-solid">
            <NavLink href={`/organization/${currentOrganization}/settings`}>
              Settings & Billing
            </NavLink>
          </Button>
        )}
      </nav>
    </div>
  )
}