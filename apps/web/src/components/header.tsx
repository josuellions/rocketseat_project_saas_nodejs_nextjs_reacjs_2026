import Image from "next/image"
import { Slash } from "lucide-react"

import { OrganizationSwitcher } from "./organization-switcher"
import { ProjectSwitcher } from "./project-switcher"
import { ThemeSwither } from "./theme/themeSwither"
import { ProfileButton } from "./profile-button"
import { Separator } from "./ui/separator"

import logo from "@/assets/img/logos/logo_01.png"
import { ability } from "@/auth/auth"

export async function Header() {
  const premissions = await ability();

  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between border-b pb-2">
      <div className="flex items-center gap-3">
        <Image src={logo} alt="logo project manager" className="object-cover object-center w-16 h-16 rounded-full"/>
      
        <Slash className="size-4 -rotate-[24deg] text-border"/>

        <OrganizationSwitcher/>

        {premissions?.can('get', 'Project') && (
          <>
            <Slash className="size-4 -rotate-[24deg] text-border"/>
            <ProjectSwitcher/>
          </>
        )}

      </div>
      <div className="flex items-center gap-4">
        <ThemeSwither />
        <Separator orientation="vertical" className="h-5"/>
        <ProfileButton/>
      </div>
    </div>
  )
}