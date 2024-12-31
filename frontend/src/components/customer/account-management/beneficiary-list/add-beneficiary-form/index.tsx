"use client"

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
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useMutation } from "@tanstack/react-query"
import { getPartners } from "@/api/partner.api"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { createBeneficiaryApi } from "@/api/beneficiaries.api"
import { AxiosError } from "axios"
import { checkExistApi } from "@/api/customer.api"
import { checkExistInterbankAccountsApi } from "@/api/interbank"

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
    remindName: z.string(),
})

export default function AddBeneficiaryForm({ onSuccess }: { onSuccess: () => void }) {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bankName: "",
            accountNumber: "",
            remindName: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const { bankName, accountNumber, remindName } = values;
        setIsSubmitting(true);
        mutateCreateBeneficiary({ bankName, accountNumber, remindName: remindName !== "" ? remindName : recevier });
    }

    const [bankNames, setBankNames] = useState<string[]>([]);

    const { mutate: mutatePartners } = useMutation({
        mutationFn: getPartners,
        onSuccess: (response) => {
            if (response.status === 200) {
                setBankNames(response.data.map((item) => item.bankName))
            }
        },
        onError: (error: AxiosError) => {
            const message = (error.response?.data as { message: string }).message;

            toast({
                variant: "destructive",
                title: "Không lấy được danh sách ngân hàng",
                description: message,
            });
        },
    });

    useEffect(() => {
        mutatePartners();
    }, [mutatePartners])

    const [recevier, setReceiver] = useState<string | undefined>();

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
                setReceiver(undefined);
                form.setValue("remindName", "");
                form.setError("accountNumber", {
                    type: "manual",
                    message: "Không tìm thấy số tài khoản"
                })
            },
        });

        const { mutate: mutateInterbankReceiver } = useMutation({
            mutationFn:  checkExistInterbankAccountsApi,
            onSuccess: (response) => {
                console.log(response.data);
                if (response.status === 200) {
                    setReceiver(response.data.fullName);
                    form.clearErrors("accountNumber");
                }
            },
            onError: () => {
                setReceiver(undefined);
                form.setValue("remindName", "");
                form.setError("accountNumber", {
                    type: "manual",
                    message: "Không tìm thấy số tài khoản"
                })
            },
        });

    const handleMutateReceiver = () => {
        if (import.meta.env.VITE_BANK_NAME === form.getValues("bankName")) {
            mutateReceiver(form.getValues("accountNumber"))
        }
        else {
            mutateInterbankReceiver({bankName: form.getValues("bankName"), accountNumber: form.getValues("accountNumber")})
        }
    }

    const [submitStatus, setSubmitStatus] = useState<"default" | "submitting" | "failed" | "success">("default");

    useEffect(() => {
        if (submitStatus === "success") onSuccess();
    }, [submitStatus])

    const { mutate: mutateCreateBeneficiary } = useMutation({
        mutationFn: createBeneficiaryApi,
        onSuccess: (response) => {
            setIsSubmitting(false);

            if (response.status === 201) {
                setSubmitStatus("success");
                toast({
                    variant: "default",
                    title: "Thêm người thụ hưởng thành công"
                });
            }
        },
        onError: (error: AxiosError) => {
            setIsSubmitting(false);
            setSubmitStatus("failed");

            const message = (error.response?.data as { message: string }).message;

            toast({
                variant: "destructive",
                title: "Thêm người thụ hưởng thất bại",
                description: message,
            });
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="dialog-form">
                <DialogHeader>
                    <DialogTitle>
                        Thêm người thụ hưởng
                    </DialogTitle>
                </DialogHeader>
                <FormMainContent>
                    <FormHorizontalGroupFields>
                        <FormField
                            control={form.control}
                            name="bankName"
                            required
                            render={({ field }) => (
                                <FormItem className="max-w-[200px]">
                                    <FormLabel>Ngân hàng</FormLabel>
                                    <Select onValueChange={(event) => {
                                        field.onChange(event);
                                        handleMutateReceiver();
                                    }} defaultValue={field.value}>
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
                        <FormField
                            control={form.control}
                            name="accountNumber"
                            required
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số tài khoản</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập STK..." {...field} type="number" onBlur={handleMutateReceiver}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </FormHorizontalGroupFields>
                    <FormField
                        control={form.control}
                        name="remindName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên gợi nhớ</FormLabel>
                                <FormControl>
                                    <Input placeholder={recevier ?? "Nhập tên gợi nhớ..."} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormMainContent>
                <DialogFooter>
                    <LoadingButton type="submit" isLoading={isSubmitting}>Thêm người thụ hưởng mới</LoadingButton>
                </DialogFooter>

            </form>
        </Form>
    )
}
