'use client'

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronsUpDown, Loader2, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

import { getProjects } from "@/http/get-projects";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

export function ProjectSwitcher() {
  const  {slug: organizationSlug, project: projectSlug } = useParams<{
    slug: string,
    project: string
  }>()

  const { data, isLoading } = useQuery({
    queryKey: [organizationSlug, 'projects'],
    queryFn: () => getProjects(organizationSlug),
    enabled: !!organizationSlug
  })

  const currentProject = data?.projects && projectSlug ? 
    data.projects.find((project) => project.slug === projectSlug) : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[168px] items-center gap-2 text-sm p-1 font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
       {isLoading ? (
        <>
          <Skeleton className="size-5 rounded-full shrink-0"/>
          <Skeleton className="h-4 w-full"/>
          <Loader2 className="ml-auto size-4 shrink-0 text-muted-foreground animate-spin "/>
        </>
       ): (
        <>
          {currentProject ? (
            <>
              <Avatar className="mr-2 size-4">
                {currentProject?.avatarUrl && <AvatarImage src={currentProject.avatarUrl}/>}
                <AvatarFallback/>
              </Avatar>
                <span className="line-clamp-1 text-left">{currentProject?.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Select project</span>
          )}

           <ChevronsUpDown className="ml-auto size-4 text-muted-foreground shrink-0"/>
        </>
      )}
    
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {data?.projects?.map((project: any) => (
            <DropdownMenuItem key={project.id} asChild>
              <Link href={`/organization/${organizationSlug}/project/${project.slug}`}>
                <Avatar className="mr-2 size-4">
                  {project.avatarUrl && <AvatarImage src={project.avatarUrl}/>}
                  <AvatarFallback/>
                </Avatar>
                <span className="line-clamp-1">{project.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator/>
        <DropdownMenuItem asChild>
          <Link href={`/organization/${organizationSlug}/create-project`}>
            <PlusCircle className="mr-2 size-4"/>
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}