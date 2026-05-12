import AuthLayout  from "../app/auth/layout";
import SingInPage from "./auth/sign-in/page";
import SingUpPage from "./auth/sign-up/page";

export default function Home() {
  return (
     <AuthLayout>
      
        {/* <SingInPage/> */}
        <SingUpPage/>
     </AuthLayout>
  )
}
