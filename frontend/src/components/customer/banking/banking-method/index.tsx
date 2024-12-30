import { PropsWithChildren } from "react"

interface Props {
    isSelected?: boolean,
    onSelect?: () => void
}

export default function BankingMethod(props: PropsWithChildren<Props>) {
    return (
        <div className={`p-4 flex flex-col gap-y-3 border-2 rounded-lg bg-popover items-center ${props.isSelected ? "border-primary" : "border-muted cursor-pointer"}`} onClick={props.onSelect}>
            {props.children}
        </div>
    )
}