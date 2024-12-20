"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
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
    remindName: z.string()
        .nonempty(),
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
        mutateCreateBeneficiary({ bankName, accountNumber, remindName });
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

    const [submitStatus, setSubmitStatus] = useState<"default" | "submitting" | "failed" | "success">("default");

    useEffect(() => {
        if (submitStatus === "success") onSuccess();
    }, [submitStatus])

    const { mutate: mutateCreateBeneficiary } = useMutation({
        mutationFn: createBeneficiaryApi,
        onSuccess: (response) => {
            if (response.status === 201) {
                setSubmitStatus("success");
                toast({
                    variant: "default",
                    title: "Thêm người thụ hưởng thành công"
                });
            }
        },
        onError: (error: AxiosError) => {
            setSubmitStatus("failed");

            const message = (error.response?.data as { message: string }).message;

            toast({
                variant: "destructive",
                title: "Thêm người thụ hưởng thất bại",
                description: message,
            });
        },
    });

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
                                <FormItem>
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
                        <FormField
                            control={form.control}
                            name="accountNumber"
                            required
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số tài khoản</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập STK..." {...field} />
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
                                    <Input placeholder="Nhập tên gợi nhớ..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormMainContent>
                <DialogFooter>
                    <Button type="submit">Submit</Button>
                </DialogFooter>

            </form>
        </Form>
    )
}
