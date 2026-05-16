import {Header} from "@/components/header";

export default async function Home() {

  return (
    <div className="space-y-4">
      <Header/>
      
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
          <h1 className="text-2xl w-full text-center">Home</h1>
          <div className="w-full flex flex-col items-center">
            <p className="text-sm text-muted-foreground">Select an organization.</p>
          </div>
      </main>
    </div>
  )
}
