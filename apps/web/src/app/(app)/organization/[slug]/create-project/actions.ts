'use server'

import { z } from "zod";
import { HTTPError } from "ky";

import { createProject } from "@/http/create-project";
import { getCurrentOrganization } from "@/auth/auth";

const projectSchema = z.object({
  name: z.string().min(4, {message: 'Please, include at least 4 characters.'}),
  description: z.string().nullable()
})

export async function createProjectAction( data: FormData) {
 
  const result = projectSchema.safeParse(Object.fromEntries(data));

  if(!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors}
  }

  const { name, description } = result.data;

  //await new Promise((resolve) => setTimeout(resolve, 2000));
  const getOrganization = await getCurrentOrganization()
  
  try {
    await createProject({
      name,
      description,
      organization: getOrganization!
    })

  } catch (err) {
    if(err instanceof HTTPError) {
      const { message } = await err.response.json();
      
      return {success: false, message, errors: null};  
    }
    console.error(err);

    return {success: false, message: 'Unexpected error, try again in a few minutes.', errors: null};  
  }

  return {success: true, message: "Successfully saved the project.", errors: null};
}