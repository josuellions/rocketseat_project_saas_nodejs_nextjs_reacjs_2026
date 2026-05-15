import React from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/auth/auth";

export default async function AppLayout({
  children,
  sheet
}:  Readonly<{
    children: React.ReactNode
    sheet: React.ReactNode
  }
  >) {

  if(!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

   return (
    <div className="py-4 space-y-4">
        {children}
        {sheet}
    </div>
  )
}