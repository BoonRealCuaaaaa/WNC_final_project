"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button, LoadingButton } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormHorizontalGroupFields,
    FormItem,
    FormLabel,
    FormMainContent,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { getPartners } from "@/api/partner.api"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { AxiosError } from "axios"
import BankingMethod from "../banking-method";
import { BookUser, CreditCardIcon, LandmarkIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { thoudsandsSeparator } from "@/lib/string";
import { bankTransferApi, checkExistApi, getPaymentAccountApi } from "@/api/customer.api";
import { FeePayer, PaymentTransaction } from "@/types/PaymentTransaction";
import { checkExistInterbankAccountsApi } from "@/api/interbank";

const formSchema = z.object({
    bankName: z.string()
        .nonempty({
            message: "Vui lòng chọn ngân hàng",
        }),
    accountNumber: z.string()
        .nonempty({
            message: "Vui lòng điền số tài khoản"
        })
        .regex(/^\d+$/, {
            message: "Số tài khoản chỉ có thể chứa các chữ số",
        }),
    content: z.string(),
    amount: z.coerce.number({
        required_error: "Vui lòng nhập số tiền cần chuyển",
    }).min(1000, {
        message: "Số tiền chuyển không được dưới 1000đ."
    }),
    feePayer: z.string().nonempty({
        message: "Vui lòng chọn hình thức trả phí"
    })
})

enum MethodEnum {
    LOCAL,
    INTERBANK
}

interface Props {
    receiver: string;
    setReceiver: (receiverName: string) => void
    onCreateSuccess: (PaymentTransaction) => void,
    paymentTransaction: PaymentTransaction
}

export default function CreateTransactionForm({receiver, setReceiver, onCreateSuccess, paymentTransaction}: Props) {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bankName: paymentTransaction.desBankName,
            accountNumber: paymentTransaction.desAccount,
            content: paymentTransaction.content,
            feePayer: paymentTransaction.feePayer,
            amount: paymentTransaction.amount
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log("Submit");
        setIsSubmitting(true);
        mutateBankTransfer({
            amount: values.amount,
            content: values.content,
            desAccount: values.accountNumber,
            desBankName: values.bankName,
            feePayer: values.feePayer
        })
    }

    const [bankNames, setBankNames] = useState<string[]>([]);

    const { mutate: mutatePartners } = useMutation({
        mutationFn: getPartners,
        onSuccess: (response) => {
            if (response.status === 200) {
                setBankNames(
                    response.data
                        .filter((item) => item.bankName !== "OWN_BANK") // Exclude "OWN_BANK"
                        .map((item) => item.bankName)
                );
            }
        },
        onError: (error: AxiosError) => {
            const message = (error.response?.data as { message: string }).message;

            toast({
                variant: "destructive",
                title: "Lấy danh sách ngân hàng thất bại",
                description: message,
            });
        },
    });

    const [balance, setBalance] = useState(0);

    const { mutate: mutatePaymmentAccount } = useMutation({
            mutationFn: getPaymentAccountApi,
            onSuccess: (response) => {
                if (response.status === 200) {
                    setBalance(response.data.balance);
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
        mutatePartners();
        mutatePaymmentAccount();
    }, [mutatePartners, mutatePaymmentAccount])

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { mutate: mutateBankTransfer } = useMutation({
        mutationFn: bankTransferApi,
        onSuccess: (response) => {
            if (response.status === 200) {
                setIsSubmitting(false);
                onCreateSuccess({
                    id: response.data.id,
                    amount: response.data.amount,
                    content: response.data.content,
                    desOwner: response.data.desOwner,
                    desAccount: response.data.desAccount,
                    desBankName: response.data.desBankName,
                    fee: response.data.fee,
                    feePayer: response.data.feePayer
                })
            }
        },
        onError: (error: AxiosError) => {
            setIsSubmitting(false);

            const message = (error.response?.data as { message: string }).message;
            
            toast({
                variant: "destructive",
                title: "Tạo lệnh chuyển khoản thất bại",
                description: message,
            });
        },
    });

    const [method, setMethod] = useState<MethodEnum>(MethodEnum.LOCAL);

    const { mutate: mutateReceiver } = useMutation({
        mutationFn:  checkExistApi,
        onSuccess: (response) => {
            console.log(response.data);
            if (response.status === 200) {
                setReceiver(response.data.fullName);
                form.clearErrors("accountNumber");
            }
        },
        onError: () => {
            setReceiver("");
            form.setError("accountNumber", {
                type: "manual",
                message: "Không tìm thấy số tài khoản"
            })
        },
    });
    
    const { mutate: mutateInterbankReceiver } = useMutation({
        mutationFn: checkExistInterbankAccountsApi,
        onSuccess: (response) => {
            if (response.status === 200) {
                setReceiver(response.data.fullName);
                form.clearErrors("accountNumber");
            }
        },
        onError: () => {
            setReceiver("");
            form.setError("accountNumber", {
                type: "manual",
                message: "Không tìm thấy số tài khoản"
            })
        },
    });

    const changeMethod = (newMethod: MethodEnum) => {
        if (method === newMethod) return;
        setMethod(newMethod);
        if (newMethod === MethodEnum.LOCAL) form.setValue("bankName", import.meta.env.VITE_BANK_NAME);
        else form.setValue("bankName", "");
    }

    return (
        <Card className="w-[600px]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="card-form">
                    <CardHeader>
                        <CardTitle>Loại chuyển khoản</CardTitle>
                        <CardDescription>Vui lòng chọn loại chuyển khoản bạn mong muốn</CardDescription>
                    </CardHeader>
                    <FormMainContent className="py-0">
                        <div className="gap-x-4 grid grid-cols-2">
                            <BankingMethod isSelected={method === MethodEnum.LOCAL} onSelect={() => changeMethod(MethodEnum.LOCAL)}>
                                <CreditCardIcon className="size-4" />
                                Nội bộ
                            </BankingMethod>
                            <BankingMethod isSelected={method === MethodEnum.INTERBANK} onSelect={() => changeMethod(MethodEnum.INTERBANK)}>
                                <LandmarkIcon className="size-4" />
                                Liên ngân hàng
                            </BankingMethod>
                        </div>
                        <FormHorizontalGroupFields>
                            {method === MethodEnum.INTERBANK &&
                                <FormField
                                    control={form.control}
                                    name="bankName"
                                    required
                                    render={({ field }) => (
                                        <FormItem className="max-w-[200px]">
                                            <FormLabel>Ngân hàng</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn ngân hàng..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {bankNames.map(bankName =>
                                                        <SelectItem value={bankName}>{bankName}</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            }
                            <FormField
                                control={form.control}
                                name="accountNumber"
                                required
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Người nhận</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Input placeholder="Nhập số tài khoản người nhận tiền..." {...field} type="number" onBlur={(event) => method === MethodEnum.INTERBANK ? mutateInterbankReceiver({bankName: form.getValues("bankName"), accountNumber: event.target.value}) : mutateReceiver(event.target.value)}/>
                                                <Button variant="outline-primary"><BookUser /></Button>
                                            </div>
                                        </FormControl>
                                        <div className="px-3 text-sm font-semibold text-primary">{receiver}</div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FormHorizontalGroupFields>
                        <FormField
                            control={form.control}
                            name="amount"
                            required
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center">
                                        <FormLabel>Số tiền chuyển</FormLabel>
                                        <Label>Số dư hiện tại: <b className="text-primary">{thoudsandsSeparator(balance)}</b> đ</Label>
                                    </div>
                                    <FormControl>
                                        <Input placeholder="Nhập số tiền cần chuyển..." {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nội dung</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập nội dung chuyển tiền..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="feePayer"
                            required
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between">
                                        <FormLabel>Hình thức trả phí</FormLabel>
                                        <FormControl>
                                            <RadioGroup className="flex gap-x-8" onValueChange={field.onChange} defaultValue={field.value}>
                                                <div></div>
                                                <RadioGroupItem value={FeePayer.SENDER}>Người gửi trả phí</RadioGroupItem>
                                                <RadioGroupItem value={FeePayer.RECEVIER}>Người nhận trả phí</RadioGroupItem>
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </FormMainContent>
                    <LoadingButton type="submit" isLoading={isSubmitting}>Chuyển tiền</LoadingButton>
                </form>
            </Form>
        </Card>
    )
}