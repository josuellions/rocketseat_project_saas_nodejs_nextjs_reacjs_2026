import {Header} from "@/components/header";

export default async function Projects() {

  return (
    <div className="space-y-4">
      <Header/>
      
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
         <h1 className="text-2xl w-full">Projects</h1>
        <div>
          <p className="text-sm text-muted-foreground px-4">List projects.</p>
          <pre>
            {/* {JSON.stringify(user, null, 2)} */}
          </pre>
        </div>
     </main>
    </div>
  )
}