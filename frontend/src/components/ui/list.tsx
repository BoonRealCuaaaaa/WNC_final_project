import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { ScrollBar } from "./scroll-area"

const List = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow w-full py-6 flex flex-col gap-y-6 h-full",
      className
    )}
    {...props}
  />
))
List.displayName = "List"

const ListHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-row justify-between gap-y-1.5 px-6 items-center", className)}
    {...props}
  />
))
ListHeader.displayName = "ListHeader"

const ListTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-[16px]/[16px]", className)}
    {...props}
  />
))
ListTitle.displayName = "ListTitle"

const ListDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
ListDescription.displayName = "ListDescription"

const ListTitleGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-y-1.5", className)}
    {...props}
  />
))
ListTitleGroup.displayName = "ListTitleGroup"

const ListContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("px-2 h-full", className)} {...props}>
    <ScrollArea className="h-full overflow-auto">
      <div className="h-0 flex flex-col gap-y-4">
        {children}
      </div>
      <ScrollBar />
    </ScrollArea>
  </div>
))
ListContent.displayName = "ListContent"

const ListItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full flex px-4 py-2 rounded-sm hover:bg-accent font-medium leading-none tracking-tight text-[14px]/[14px] items-center", className)} {...props} />
))
ListItem.displayName = "ListItem"

const ListActionGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex", className)} {...props} />
))
ListActionGroup.displayName = "ListActionGroup"

const ListAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props}>
    <Button variant="ghost" size="icon">
      {children}
    </Button>
  </div>
))
ListAction.displayName = "ListAction"

const ListFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
ListFooter.displayName = "ListFooter"

export { List, ListHeader, ListFooter, ListTitle, ListDescription, ListTitleGroup, ListContent, ListItem, ListAction, ListActionGroup }
