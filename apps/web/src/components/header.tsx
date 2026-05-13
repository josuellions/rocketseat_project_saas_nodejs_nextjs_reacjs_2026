import Image from "next/image"

import logo from "@/assets/img/logos/logo_01.png"
import { ProfileButton } from "./profile-button"

export function Header() {
  return (
    <div className="w-full flex mx-auto max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
       <Image src={logo} alt="logo project manager" className="object-cover object-center w-16 h-16 rounded-full" priority/>
      </div>
      <div className="flex items-center gap-4">
        <ProfileButton/>
      </div>
    </div>
  )
}