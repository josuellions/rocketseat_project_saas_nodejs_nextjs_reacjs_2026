import dayjs from 'dayjs';
import Link from 'next/link';
import { ArrowRight } from "lucide-react"
import relativeTime from 'dayjs/plugin/relativeTime';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { getCurrentOrganization } from "@/auth/auth"
import { getProjects } from "@/http/get-projects"

dayjs.extend(relativeTime)

export default async function ProjectList() {
  const currentOrganization = await getCurrentOrganization();
  const { projects } = await getProjects(currentOrganization!)
  
  return(
    <div className="grid grid-cols-3 gap-4">
      {projects?.map(project => {
        return(
          <Card key={project.id} className='flex flex-col justify-between'>
            <CardHeader>
              <CardTitle className='text-lg font-medium truncate'>{project.name}</CardTitle>
              <CardDescription className="line-clamp-2  min-h-[3rem] leading-relaxed">
                {project.description}
              </CardDescription>
              <CardFooter className="felx item-center gap-1.5 mb-4">
                <Avatar className="size-4">
                  {project.owner.avatarUrl && (
                    <AvatarImage src={project.owner.avatarUrl}/>
                  )}
                  <AvatarFallback/>
                </Avatar>

                <span className="text-xs text-muted-foreground"> 
                  Created by <span className="font-medium text-foreground">
                    {project.owner.name}</span>{" "}
                    {dayjs(project.createdAt).fromNow()}
                </span>

                <Button asChild variant="outline" size="xs" className="ml-auto">
                  <Link href={`/organization/${currentOrganization}/project/${project.slug}`}>
                    View <ArrowRight className="size-3 ml-2"/>
                  </Link>
                </Button>
              </CardFooter>
            </CardHeader>
          </Card>
        )
      })}
     
    </div>
  )
}