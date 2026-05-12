import AuthLayout  from "../app/auth/layout";
import SingInPage from "./auth/sign-in/page";

export default function Home() {
  return (
     <AuthLayout>
      <h1 className="text-center text-lg">Gestor de projetos</h1>
        <SingInPage/>
     </AuthLayout>
  )
}
