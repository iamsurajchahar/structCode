
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { type CheckedState } from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"

// Custom type that accepts both CheckedState handlers and boolean state setters
type CheckboxOnCheckedChange = 
  | ((checked: CheckedState) => void)
  | ((checked: boolean) => void)
  | React.Dispatch<React.SetStateAction<boolean>>

interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onCheckedChange'> {
  onCheckedChange?: CheckboxOnCheckedChange
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, onCheckedChange, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      onCheckedChange={(checked: CheckedState) => {
        if (onCheckedChange) {
          // Convert CheckedState to boolean for compatibility with React state setters
          const booleanValue = checked === "indeterminate" ? false : checked;
          // Call the handler with the converted boolean value
          (onCheckedChange as any)(booleanValue);
        }
      }}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
