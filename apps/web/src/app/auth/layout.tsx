import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";

import logo from "@/assets/img/logos/logo_01.png"
import { isAuthenticated } from "@/auth/auth";

export default async function AuthLayout({
  children
}:  Readonly<{
    children: React.ReactNode}
  >) {

  if(await isAuthenticated()) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col px-4">
     <div className="w-full max-w-xs flex flex-col gap-4">
      <div className="flex flex-col justify-center rounded-lg">
        <Image src={logo} alt="logo project manager" className="full rounded-2xl" priority/>
      </div>
       {children}
     </div>
    </div>
  )
}