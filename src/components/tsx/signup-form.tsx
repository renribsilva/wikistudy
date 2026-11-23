"use client";

import { useActionState } from "react";
import { signup } from "@/app/lib/auth/actions";

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm mb-1">
          Nome
        </label>
        <input
          id="name"
          name="name"
          placeholder="Seu nome"
          className="w-full border rounded px-3 py-2"
        />
        {state?.errors?.name && (
          <p className="text-sm text-red-600 mt-1">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm mb-1">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          className="w-full border rounded px-3 py-2"
        />
        {state?.errors?.email && (
          <p className="text-sm text-red-600 mt-1">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm mb-1">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full border rounded px-3 py-2"
        />
        {state?.errors?.password && (
          <div className="text-sm text-red-600 mt-1">
            <p>A senha deve:</p>
            <ul className="list-disc list-inside">
              {state.errors.password.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {state?.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <button
        disabled={pending}
        type="submit"
        className="w-full border rounded py-2 font-medium disabled:opacity-50"
      >
        {pending ? "Cadastrando..." : "Cadastrar"}
      </button>
    </form>
  );
}
