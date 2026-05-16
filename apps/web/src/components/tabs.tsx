import { Button } from "./ui/button";
import { NavLink } from "./nav-link";

import { getCurrentOrganization } from "@/auth/auth";

export default async function  Tabs() {
  const currentOrganization = await getCurrentOrganization();

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-[1200px] items-center gap-2">
        <Button asChild variant="ghost" size={"sm"} className="text-muted-foreground border border-none data-[current=true]:text-foreground data-[current=true]:border-border data-[current=true]:border-solid">
          <NavLink href={`/organization/${currentOrganization}`}>
            Projects
          </NavLink>
        </Button>
        <Button asChild variant="ghost" size={"sm"} className="text-muted-foreground border border-none data-[current=true]:text-foreground data-[current=true]:border-border data-[current=true]:border-solid">
          <NavLink href={`/organization/${currentOrganization}/members`}>
            Members
          </NavLink>
        </Button>
        <Button asChild variant="ghost" size={"sm"} className="text-muted-foreground border border-none data-[current=true]:text-foreground data-[current=true]:border-border data-[current=true]:border-solid">
          <NavLink href={`/organization/${currentOrganization}/settings`}>
            Settings & Billing
          </NavLink>
        </Button>
      </nav>
    </div>
  )
}