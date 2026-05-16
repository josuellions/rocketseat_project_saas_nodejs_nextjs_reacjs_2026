import { InterceptedSheetContent } from "@/components/intercepted-sheet-content";
import { Sheet, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { ProjectForm } from "@/app/(app)/organization/[slug]/create-project/project-form";

export default function CreateProject() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Create project</SheetTitle>
        </SheetHeader>
        <div className="px-4 py-4">
          <ProjectForm/>
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}