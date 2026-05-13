import Image from "next/image"

import logo from "@/assets/img/logos/logo_01.png"
import { auth } from "@/auth/auth"

export default async function Home() {
  const { user } = await auth();



  return (
     <div className="min-h-screen flex items-center justify-center flex-col px-4">
     <div className="w-full max-w-xs flex flex-col gap-4 items-center space-y-4">
      <div className="flex flex-col justify-center rounded-lg">
        <Image src={logo} alt="logo project manager" className="full rounded-2xl" priority/>
      </div>
        <h1>HOME</h1>
        <div>
          <pre>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
     </div>
    </div>
  )
}
