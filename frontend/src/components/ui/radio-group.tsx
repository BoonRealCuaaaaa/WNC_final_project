import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex items-end gap-x-2 text-[14px]/[14px]",
        className
      )}
    >
      <RadioGroupPrimitive.Item
        ref={ref}
        className="aspect-square size-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="relative block">
          <Check className="size-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {children}
    </div>

  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName


export { RadioGroup, RadioGroupItem }
