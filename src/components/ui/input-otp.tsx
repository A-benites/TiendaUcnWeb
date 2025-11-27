"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputOTPProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

function InputOTP({ length = 6, value, onChange, disabled = false, className }: InputOTPProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = React.useCallback(
    (index: number) => {
      if (index >= 0 && index < length) {
        inputRefs.current[index]?.focus();
      }
    },
    [length]
  );

  const handleChange = React.useCallback(
    (index: number, inputValue: string) => {
      if (!/^\d*$/.test(inputValue)) return;

      const newValue = value.split("");
      newValue[index] = inputValue.slice(-1);

      const result = newValue.join("").slice(0, length);
      onChange(result);

      if (inputValue && index < length - 1) {
        focusInput(index + 1);
      }
    },
    [value, length, focusInput, onChange]
  );

  const handleKeyDown = React.useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !value[index] && index > 0) {
        focusInput(index - 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [value, focusInput]
  );

  const handlePaste = React.useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);

      if (pastedData) {
        onChange(pastedData);
        focusInput(Math.min(pastedData.length, length - 1));
      }
    },
    [length, focusInput, onChange]
  );

  return (
    <div className={cn("flex justify-center gap-2 sm:gap-3", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "h-12 w-10 sm:h-14 sm:w-12 text-center text-xl sm:text-2xl font-semibold",
            "rounded-lg border-2 bg-background",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "border-input"
          )}
        />
      ))}
    </div>
  );
}

export { InputOTP };
