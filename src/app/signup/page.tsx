import Link from "next/link";
import SignupForm from "@/components/tsx/signup-form";

export default function SignupPage() {
  return (
    <div className="max-w-sm mx-auto mt-16 p-6 border rounded">
      <h1 className="text-xl font-semibold mb-4">Criar conta</h1>
      <SignupForm />
      <p className="text-sm mt-4">
        Já tem conta?{" "}
        <Link href="/login" className="underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
