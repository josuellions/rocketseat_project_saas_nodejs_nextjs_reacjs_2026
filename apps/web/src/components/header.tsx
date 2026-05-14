import Image from "next/image"

import logo from "@/assets/img/logos/logo_01.png"
import { ProfileButton } from "./profile-button"
import { OrganizationSwitcher } from "./organization-switcher"
import { Slash } from "lucide-react"

import { ability } from "@/auth/auth"

export async function Header() {
  const premissions = await ability();

  return (
    <div className="w-full flex mx-auto max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src={logo} alt="logo project manager" className="object-cover object-center w-16 h-16 rounded-full" priority/>
      
        <Slash className="size-4 -rotate-[24deg] text-border"/>

        <OrganizationSwitcher/>

        {premissions?.can('get', 'Project') && <p>Projects</p>}

      </div>
      <div className="flex items-center gap-4">
        <ProfileButton/>
      </div>
    </div>
  )
}