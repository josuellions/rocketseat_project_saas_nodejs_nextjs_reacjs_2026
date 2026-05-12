import AuthLayout  from "../app/auth/layout";
import SingInPage from "./auth/sign-in/page";

export default function Home() {
  return (
     <AuthLayout>
        <SingInPage/>
     </AuthLayout>
  )
}
