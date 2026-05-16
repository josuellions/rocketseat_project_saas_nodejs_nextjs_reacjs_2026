export default async function Project() {

  return (
    <div className="space-y-4">
         <h1 className="text-2xl w-full">Project</h1>
        <div>
          <p className="text-sm text-muted-foreground px-4">Project current.</p>
          <pre>
            {/* {JSON.stringify(user, null, 2)} */}
          </pre>
        </div>
    </div>
  )
}