import React from "react";

import { Header } from "@/components/header";
import Tabs from "@/components/tabs";

export default async function organizationLayout({
  children,
}:  Readonly<{
    children: React.ReactNode
  }
  >) {
   return (
    <div className="py-4 mx-auto w-full max-w-[1200px]">
       <Header/>
       <Tabs />     
      <main className="space-y-4">
        {children}
      </main>
    </div>
  )
}