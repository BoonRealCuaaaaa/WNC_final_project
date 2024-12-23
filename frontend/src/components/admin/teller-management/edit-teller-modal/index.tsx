import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PropsWithChildren } from "react";
import * as Form from "@radix-ui/react-form";
import { Teller } from "@/types/teller";
import { useForm } from "react-hook-form";

interface EditTellerModalProps {
  handleEdit?: (tellerId: number, data: Record<string, unknown>) => void;
  teller: Teller;
}

type EditTellerModalWithChildrenProp = EditTellerModalProps & PropsWithChildren;

export default function EditTellerModal({
  children,
  handleEdit,
  teller,
}: EditTellerModalWithChildrenProp) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      username: teller.username,
      fullName: teller.fullName,
      email: teller.email,
      phone: teller.phone,
    },
  });

  console.log("errors:::", errors);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa giao dịch viên</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form.Root
            className="w-full"
            onSubmit={handleSubmit((data) => {
              handleEdit(teller.id, data);
              console.log(data);
            })}
          >
            <Form.Field className="mb-1 grid" name="email">
              <div className="flex items-baseline justify-between">
                <Form.Label className="text-[15px] font-medium leading-[35px] ">
                  Tên đăng nhập
                </Form.Label>
              </div>
              <Form.Control asChild>
                <input
                  type="text"
                  className="h-9 px-2 outline-none border-slate-400 border rounded-sm w-full"
                  {...register("username", {
                    required: "Tên tài khoản không thể để trống",
                  })}
                  required
                />
              </Form.Control>
              <div className="text-red-500 text-end text-[13px]">{errors.username?.message}</div>
            </Form.Field>
            <Form.Field className="mb-1 grid" name="fullName">
              <div className="flex items-baseline justify-between">
                <Form.Label className="text-[15px] font-medium leading-[35px] ">
                  Họ tên
                </Form.Label>
              </div>
              <Form.Control asChild>
                <input
                  type="text"
                  className="h-9 px-2 outline-none border-slate-400 border rounded-sm w-full"
                  {...register("fullName", {
                    required: "Họ tên không thể để trống",
                  })}
                  required
                />
              </Form.Control>
              <div className="text-red-500 text-end text-[13px]">{errors.fullName?.message}</div>
            </Form.Field>
            <Form.Field className="mb-1 grid" name="phone">
              <div className="flex items-baseline justify-between">
                <Form.Label className="text-[15px] font-medium leading-[35px] ">
                  Số điện thoại
                </Form.Label>
              </div>
              <Form.Control asChild>
                <input
                  type="tel"
                  className="h-9 px-2 outline-none border-slate-400 border rounded-sm w-full"
                  {...register("phone", {
                    required: "Số điện thoại không thể để trống",
                    pattern: {
                      value: /[0-9]{3}-[0-9]{3}-[0-9]{4}/i,
                      message: "Số điện thoại không hợp lệ",
                    },
                  })}
                  placeholder="000-000-0000"
                  required
                />
              </Form.Control>
              <div className="text-red-500 text-end text-[13px]">{errors.phone?.message}</div>
            </Form.Field>
            <Form.Field className="mb-1 grid" name="email">
              <div className="flex items-baseline justify-between">
                <Form.Label className="text-[15px] font-medium leading-[35px] ">
                  Email
                </Form.Label>
              </div>
              <Form.Control asChild>
                <input
                  type="email"
                  className="h-9 px-2 outline-none border-slate-400 border rounded-sm w-full"
                  {...register("email", {
                    required: "Email không thể để trống",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                      message: "Email không hợp lệ",
                    },
                  })}
                  required
                />
              </Form.Control>
              <div className="text-red-500 text-end text-[13px]">{errors.email?.message}</div>
            </Form.Field>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Hủy
                </Button>
              </DialogClose>
              <Button variant="default" type="submit">
                Lưu
              </Button>
            </DialogFooter>
          </Form.Root>
        </div>
      </DialogContent>
    </Dialog>
  );
}
