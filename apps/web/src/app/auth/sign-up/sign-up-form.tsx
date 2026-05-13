'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AsteriskIcon, AlertTriangle  } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useFormState } from "@/hooks/use-form-state";
import { signInWithGithub } from "../action";
import { signUpAction } from "./actions";

export function SignUpForm() {
  const router = useRouter();
  const [{success, message, errors}, handleSubmit, isPending] = useFormState(
    signUpAction,
    () => {
      router.push("/auth/sign-in")
    }
  );

  return (
    <div className="space-y-6"> 
      <form onSubmit={handleSubmit} className="space-y-6">
        {success  === false && message && (
          <Alert variant={"destructive"}>
            <AlertTriangle/>
            <AlertTitle>Sign in failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input name="name" type="text" id="name"/>
          
          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
              <AsteriskIcon className="size-4"/>
              {errors.name[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input name="email" type="email" id="email"/>
          
          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
              <AsteriskIcon className="size-4"/>
              {errors.email[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input name="password" type="password" id="password"/>

          {errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
              <AsteriskIcon className="size-4"/>
              {errors.password[0]}
            </p>
          )}
        </div>
  
        <div className="space-y-2">
          <Label htmlFor="password_confirmation">Confirm your password</Label>
          <Input name="password_confirmation" type="password" id="password_confirmation"/>

          {errors?.password_confirmation && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
              <AsteriskIcon className="size-4"/>
              {errors.password_confirmation[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
           {isPending ? <Loader2 className="size-4 animate-spin"/>  :"Create account"}
        </Button>

        <Button variant="link" className="w-full border-none" size="sm" asChild>
          <Link href={"/auth/sign-in"}>
            Already registered? Sign in
          </Link>
        </Button>

      </form>

      <Separator/>

      <form action={signInWithGithub}>
        <Button 
          type="submit" 
          variant="outline" 
          className="w-full"
        >
          {/* <Image src={githubIcon} className="mr-2 size-4 dark:invert" alt=""/> */}
          <div className="mr-2 size-4 flex justify-center">
              <svg
              data-component="Octicon"
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="currentColor"
              className="inline-block overflow-visible"
            >
              <path d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943" />
            </svg>
          </div>
          Sign in with github aqui
        </Button>
      </form>
    </div>
  )
}