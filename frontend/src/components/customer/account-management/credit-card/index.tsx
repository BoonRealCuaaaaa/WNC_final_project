import { getPaymentAccountApi } from "@/api/customer.api";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { formatCardNumber, thoudsandsSeparator } from "@/lib/string";
import useAppStore from "@/store";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CreditCardIcon } from "lucide-react"
import { useEffect } from "react";

export default function CreditCard() {
    const { accountNumber, balance, update } = useAppStore((state) => state);

    const { mutate: mutatePaymmentAccount } = useMutation({
        mutationFn: getPaymentAccountApi,
        onSuccess: (response) => {
            if (response.status === 200) {
                update(response.data.accountNumber, response.data.balance);
            }
        },
        onError: (error: AxiosError) => {
            const message = (error.response?.data as { message: string }).message;

            toast({
                variant: "destructive",
                title: "Tải thông tin tài khoản thanh toán thất bại",
                description: message,
            });
        },
    });

    useEffect(() => {
        mutatePaymmentAccount();
    }, [mutatePaymmentAccount])

    return (
        <Card className="h-[125px]">
            <CardContent className="flex flex-col justify-between h-full">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                        {formatCardNumber(accountNumber)}
                    </span>
                    <CreditCardIcon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex items-baseline gap-x-1">
                    <span className="font-bold text-primary text-2xl leading-none">{thoudsandsSeparator(balance)}</span>
                    <span className="text-sm leading-none text-muted-foreground">đ</span>
                </div>
            </CardContent>
        </Card>
    )
}