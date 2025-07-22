
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type CheckedState } from "@radix-ui/react-checkbox"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkedStateToBoolean(checked: CheckedState): boolean {
  if (checked === "indeterminate") {
    return false;
  }
  return checked;
}
