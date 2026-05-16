import { ability } from "@/auth/auth";
import { redirect } from "next/navigation";

import { ProjectForm } from "./project-form";

export default async function CreateProject() {
  const premissions = await ability();

  if(premissions?.cannot('create', 'Project')) {
    redirect('/')
  }

  return (
    <div className="space-y-4">
        <h1 className="text-2xl font-bold">Create Project</h1>

        <ProjectForm />
    </div>
  )
}