import {Header} from "@/components/header";
import { auth } from "@/auth/auth"

export default async function Home() {
  const { user } = await auth();

  return (
    <div className="p-4 w-full flex flex-col gap-4 items-center">
      <Header/>
      <main className="w-full flex flex-col gap-4 items-center justify-center space-y-4">
      
        <h1>HOME</h1>
        <div>
          <pre>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
     </main>
    </div>
  )
}
