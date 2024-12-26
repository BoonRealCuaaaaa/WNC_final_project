"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormHorizontalGroupFields,
  FormItem,
  FormLabel,
  FormMainContent,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPartners } from "@/api/partner.api";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import BankingMethod from "./banking-method";
import { BookUser, CreditCardIcon, LandmarkIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import useAppStore from "@/store";
import { thoudsandsSeparator } from "@/lib/string";
import { postSearchInterbankAccountsApi } from "@/api/interbank";
import { useNavigate } from "react-router-dom";
import {
  postGenerateOtpForBankingApi,
  postSearchAccountsApi,
} from "@/api/banking";

const formSchema = z.object({
  bankName: z.string().nonempty({
    message: "Vui lòng chọn ngân hàng",
  }),
  accountNumber: z
    .string()
    .nonempty({
      message: "Vui lòng điền số tài khoản",
    })
    .regex(/^\d+$/, {
      message: "Số tài khoản chỉ có thể chứa các chữ số",
    }),
  content: z.string(),
  amount: z
    .string()
    .nonempty({
      message: "Vui lòng điền số tiền cần chuyển",
    })
    .regex(/^\d+$/, {
      message: "Số tiền chỉ có thể chứa các chữ số",
    }),
  feeMethod: z.string().nonempty({
    message: "Vui lòng chọn hình thức trả phí",
  }),
});

enum MethodEnum {
  LOCAL,
  INTERBANK,
}

export default function Banking() {
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      content: "",
      feeMethod: "sender",
    },
  });

  const bankName = form.watch("bankName");
  const accountNumber = form.watch("accountNumber");

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (account && account?.fullName.trim().length === 0) {
      toast({
        variant: "destructive",
        title: "Warning",
        description: "Số tài khoản không tồn tại",
      });
      return;
    }

    if (Number(values.amount) === 0) {
      toast({
        variant: "destructive",
        title: "Warning",
        description: "Số tiền cần chuyển không thể bằng 0",
      });
      return;
    }
    console.log("submit:::");

    const response = await postGenerateOtpForBankingApi({
      desBankName: values.bankName,
      desAccountNumber: values.accountNumber,
      amount: Number(values.amount),
      content: values.content,
    });

    console.log("submit:::", response.data);

    const infor = {
      fullName: account?.fullName as string,
      accountNumber: values.accountNumber,
      amount: values.amount,
      bankName: MethodEnum.INTERBANK ? values.bankName : "",
      content: values.content,
      feeMethod: values.feeMethod,
      fee: response.data.fee as number,
      transactionId: response.data.transactionId as number,
    };

    navigate("confirm", { state: infor });
  }

  const [bankNames, setBankNames] = useState<string[]>([]);

  const { mutate: mutatePartners } = useMutation({
    mutationFn: getPartners,
    onSuccess: (response) => {
      if (response.status === 200) {
        setBankNames(response.data.map((item) => item.bankName));
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
  }, [mutatePartners]);

  const [method, setMethod] = useState<MethodEnum>(MethodEnum.LOCAL);

  const changeMethod = (newMethod: MethodEnum) => {
    if (method === newMethod) return;
    setMethod(newMethod);
    if (method === MethodEnum.LOCAL) form.setValue("bankName", bankNames.at(0));
  };

  const { balance } = useAppStore((state) => state);

  const { data: account } = useQuery({
    queryKey: ["account", { bankName, accountNumber }],
    queryFn: async () => {
      let response;
      if (method === MethodEnum.INTERBANK) {
        response = await postSearchInterbankAccountsApi({
          bankName,
          accountNumber,
        });
      } else {
        response = await postSearchAccountsApi({
          bankName,
          accountNumber,
        });
      }

      console.log(response.data, { fullName: response.data.fullName });
      return { fullName: response.data.fullName };
    },
    refetchOnWindowFocus: false,
    enabled: !!accountNumber,
  });

  return (
    <>
      <Card className="w-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="card-form">
            <CardHeader>
              <CardTitle>Loại chuyển khoản</CardTitle>
              <CardDescription>
                Vui lòng chọn loại chuyển khoản bạn mong muốn
              </CardDescription>
            </CardHeader>
            <FormMainContent className="py-0">
              <div className="gap-x-4 grid grid-cols-2">
                <BankingMethod
                  isSelected={method === MethodEnum.LOCAL}
                  onSelect={() => changeMethod(MethodEnum.LOCAL)}
                >
                  <CreditCardIcon className="size-4" />
                  Nội bộ
                </BankingMethod>
                <BankingMethod
                  isSelected={method === MethodEnum.INTERBANK}
                  onSelect={() => changeMethod(MethodEnum.INTERBANK)}
                >
                  <LandmarkIcon className="size-4" />
                  Liên ngân hàng
                </BankingMethod>
              </div>
              <FormHorizontalGroupFields>
                {method === MethodEnum.INTERBANK && (
                  <FormField
                    control={form.control}
                    name="bankName"
                    required
                    render={({ field }) => (
                      <FormItem className="max-w-[200px]">
                        <FormLabel>Ngân hàng</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn ngân hàng..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bankNames.map((bankName) => (
                              <SelectItem key={bankName} value={bankName}>
                                {bankName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="accountNumber"
                  required
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số tài khoản</FormLabel>
                      <FormControl>
                        <div>
                          <Input
                            placeholder="Nhập STK..."
                            {...field}
                            type="number"
                          />
                          <Button variant="outline-primary">
                            <BookUser />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormHorizontalGroupFields>
              <FormField
                name="fullName"
                render={() => (
                  <FormItem>
                    <FormLabel>Họ tên người nhận</FormLabel>
                    <FormControl>
                      <Input disabled={true} value={account?.fullName || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                required
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Số tiền chuyển</FormLabel>
                      <Label>
                        Số dư hiện tại:{" "}
                        <b className="text-primary">
                          {thoudsandsSeparator(balance)}
                        </b>{" "}
                        đ
                      </Label>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Nhập số tiền cần chuyển..."
                        {...field}
                        type="number"
                      />
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
                      <Input
                        placeholder="Nhập nội dung chuyển tiền..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="feeMethod"
                required
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Hình thức trả phí</FormLabel>
                      <FormControl>
                        <RadioGroup
                          className="flex gap-x-8"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <div></div>
                          <RadioGroupItem value="sender">
                            Người gửi trả phí
                          </RadioGroupItem>
                          <RadioGroupItem value="receiver">
                            Người nhận trả phí
                          </RadioGroupItem>
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormMainContent>
            <Button type="submit">Chuyển tiền</Button>
          </form>
        </Form>
      </Card>
    </>
  );
}
