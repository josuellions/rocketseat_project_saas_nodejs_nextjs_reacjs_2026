import React from "react";

export default function AuthLayout({
  children
}:  Readonly<{
    children: React.ReactNode}
  >) {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col px-4">
     <div className="w-full max-w-xs flex flex-col gap-4">
       {children}
     </div>
    </div>
  )
}