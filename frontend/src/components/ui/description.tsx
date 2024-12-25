import * as React from "react"

import { cn } from "@/lib/utils"

const Description = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-normal text-muted-foreground", className)}
    {...props}
  />
))

export {Description}