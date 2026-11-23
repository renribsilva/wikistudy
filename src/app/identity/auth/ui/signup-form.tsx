"use client";

import { useActionState } from "react";
import { signup } from "../actions";

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">Nome</label>
        <input id="name" name="name" placeholder="Seu nome" />
      </div>
      {state?.errors?.name && <p>{state.errors.name}</p>}

      <div>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
        />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <div>
        <label htmlFor="password">Senha</label>
        <input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <div>
          <p>A senha deve:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}

      {state?.message && <p>{state.message}</p>}

      <button disabled={pending} type="submit">
        {pending ? "Cadastrando..." : "Cadastrar"}
      </button>
    </form>
  );
}
