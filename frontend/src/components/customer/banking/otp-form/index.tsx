import { Button, LoadingButton } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMainContent,
    FormMessage,
} from "@/components/ui/form"
import { useMutation } from "@tanstack/react-query"
import { FeePayer, PaymentTransaction } from "@/types/PaymentTransaction";
import { formatCurrency } from "@/lib/string";
import { payBankTransferApi } from "@/api/customer.api";
import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

interface Props {
    onBankingResult?: (boolean) => void,
    onReturn?: () => void,
    paymentTransaction: PaymentTransaction
}

const formSchema = z.object({
    otp: z.string()
        .min(6, {
            message: "Vui lòng đủ 6 chữ số OTP",
        }),
})

export default function BankingOtpForm({ onBankingResult, onReturn, paymentTransaction }: Props) {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        mutatePayBankTransfer({
            id: paymentTransaction.id,
            otp: values.otp
        })
    }

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { mutate: mutatePayBankTransfer } = useMutation({
        mutationFn: payBankTransferApi,
        onSuccess: (response) => {
            if (response.status === 200) {
                setIsSubmitting(false);
                onBankingResult(true);
            }
        },
        onError: (error: AxiosError) => {
            setIsSubmitting(false);

            const message = (error.response?.data as { message: string }).message;
            
            if (message === "OTP không hợp lệ") form.setError("otp", {
                type: "manual",
                message: message
            });
        },
    });

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <Button variant="ghost" size="icon" onClick={onReturn}><ArrowLeft /></Button>
                <CardTitle>Xác nhận chuyển khoản</CardTitle>
                <CardDescription>Vui lòng xác nhận lại thông tin giao dịch để tránh sai sót</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3">
                    <div className="static-field">
                        <div className="static-field-label">Người nhận tiền</div>
                        <div className="static-field-value">{paymentTransaction.desOwner}</div>
                    </div>
                    <div className="static-field">
                        <div className="static-field-label">Số tài khoản</div>
                        <div className="static-field-value">{paymentTransaction.desAccount}</div>
                    </div>
                    <div className="static-field">
                        <div className="static-field-label">Ngân hàng</div>
                        <div className="static-field-value">{paymentTransaction.desBankName}</div>
                    </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-y-5">
                    <div className="flex items-center justify-between">
                        <div className="static-field-label">Số tiền thực tế chuyển cho người nhận</div>
                        <div className="static-field-value font-semibold text-primary">{formatCurrency(paymentTransaction.amount)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="static-field-label">Phí giao dịch</div>
                        <div className="static-field-value">{formatCurrency(paymentTransaction.fee)} ({paymentTransaction.feePayer === FeePayer.SENDER ? "Người gửi trả" : "Người nhận trả"})</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="static-field-label">Tổng tiền bị trừ</div>
                        <div className="static-field-value font-semibold text-destructive">{formatCurrency(paymentTransaction.fee + paymentTransaction.amount)}</div>
                    </div>
                </div>
                <Separator />
                <div className="static-field">
                    <div className="static-field-label">Nội dung chuyển tiền</div>
                    <div className="static-field-value">{paymentTransaction.content}</div>
                </div>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full items-center gap-y-2.5">
                        <FormMainContent className="py-0">
                            <FormField
                                control={form.control}
                                name="otp"
                                required
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage className="text-center"/>
                                    </FormItem>
                                )}
                            />
                        </FormMainContent>
                        <div className="text-sm/4">Nhập mã xác thực được gửi đến email <b>test@gmail.com</b> của bạn</div>
                        <Button variant="link" className="p-0">Gửi lại mã xác thực</Button>
                        <CardFooter className="w-full">
                            <LoadingButton className="w-full" isLoading={isSubmitting}>Xác nhận</LoadingButton>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}