"use client";

import { useState } from "react";
import Visibility from "../svg/visibility";
import VisibilityOff from "../svg/visibility-off";

interface PasswordInputProps {
  id: string;
  name: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  inputClassName?: string;
  wrapperClassName?: string;
  toggleClassName?: string;
}

export function PasswordInput({
  id,
  name,
  autoComplete,
  required,
  placeholder,
  inputClassName,
  wrapperClassName,
  toggleClassName,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={wrapperClassName}>
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className={inputClassName}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={showPassword}
        className={toggleClassName}
      >
        {showPassword ? (
          <Visibility width="20px" height="20px" />
        ) : (
          <VisibilityOff width="20px" height="20px" />
        )}
      </button>
    </div>
  );
}
