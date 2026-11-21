"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import {
  SignupFormSchema,
  LoginFormSchema,
  FormState,
} from "@/app/lib/definitions";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/schema";
import { createSession } from "../lib/session";
import { redirect } from "next/navigation";

export async function signup(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const name = validatedFields.data.name;
  const email = validatedFields.data.email.toLowerCase();
  const password = validatedFields.data.password;
  const hashedPassword = await bcrypt.hash(password, 10);

  let user: { id: number } | undefined;

  try {
    const data = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning({ id: users.id });

    user = data[0];
  } catch (error: unknown) {
    const pgError = error as { code?: string; cause?: { code?: string } };
    const code = pgError.code ?? pgError.cause?.code;

    if (code === "23505") {
      return {
        errors: {
          email: ["Este e-mail já está cadastrado."],
        },
      };
    }

    return {
      message: "Ocorreu um erro ao criar sua conta.",
    };
  }

  if (!user) {
    return {
      message: "Ocorreu um erro ao criar sua conta.",
    };
  }

  // 4. Create user session
  await createSession(String(user.id));
  // 5. Redirect user
  redirect("/dashboard");
}

export async function login(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const email = validatedFields.data.email.toLowerCase();
  const password = validatedFields.data.password;

  try {
    // 2. Find user by email
    const data = await db.query.users.findMany({
      where: eq(users.email, email),
      columns: {
        id: true,
        password: true,
      },
    });

    const user = data[0];
    if (!user) {
      return {
        message: "E-mail ou senha inválidos.",
      };
    }

    // 3. Compare password hash
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return {
        message: "E-mail ou senha inválidos.",
      };
    }

    // 4. Create user session
    await createSession(String(user.id));
  } catch {
    return {
      message: "Ocorreu um erro ao tentar entrar.",
    };
  }

  // 5. Redirect user
  redirect("/dashboard");
}
