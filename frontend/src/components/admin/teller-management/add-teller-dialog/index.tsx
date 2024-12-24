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
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  username: string
  password: string
  fullName: string
  email: string
  phone: string
}

interface AddTellerDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleAdd: (teller: {username: string; password: string; fullName: string; email: string; phone: string;}) => void;
}

type AddTellerDialogWithChildrenProps = AddTellerDialogProps & PropsWithChildren;

export default function AddTellerDialog({
  open,
  setOpen,
  children,
  handleAdd,
}: AddTellerDialogWithChildrenProps) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const onAddSubmit: SubmitHandler<Inputs> = (data) => {
    handleAdd(data);
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm giao dịch viên</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form
            id="add-teller-form"
            className="w-full"
            onSubmit={handleSubmit(onAddSubmit)}
          >
            <div className="flex flex-col items-baseline justify-between">
              <label className="w-1/3 text-[15px] font-medium leading-[35px] ">
                Tên đăng nhập
              </label>
              <input
                type="text"
                className="h-9 px-2 outline-none border-slate-400 border rounded-sm w-full"
                {...register("username", {
                  required: "Tên tài khoản không thể để trống",
                })}
              />
              <div className="text-red-500 text-end text-[13px]">
                {errors.username?.message}
              </div>
            </div>

            <div className="flex flex-col items-baseline justify-between">
              <label className="w-1/3 text-[15px] font-medium leading-[35px] ">
                Mật khẩu
              </label>
              <input
                type="password"
                className="h-9 px-2 outline-none border-slate-400 border rounded-sm w-full"
                {...register("password", {
                  required: "Mật khẩu không thể để trống",
                })}
              />
              <div className="text-red-500 text-end text-[13px]">
                {errors.password?.message}
              </div>
            </div>

            <div className="flex flex-col items-baseline justify-between">
              <label className="w-1/3 text-[15px] font-medium leading-[35px] ">
                Họ tên
              </label>
              <input
                type="text"
                className="h-9 px-2 outline-none border-slate-400 border rounded-sm w-full"
                {...register("fullName", {
                  required: "Họ tên không thể để trống",
                })}
              />
              <div className="text-red-500 text-end text-[13px]">
                {errors.fullName?.message}
              </div>
            </div>

            <div className="flex flex-col items-baseline justify-between">
              <label className="w-1/3 text-[15px] font-medium leading-[35px] ">
                Số điện thoại
              </label>
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
              />
              <div className="text-red-500 text-end text-[13px]">
                {errors.phone?.message}
              </div>
            </div>
            <div className="flex flex-col items-baseline justify-between">
              <label className="w-1/3 text-[15px] font-medium leading-[35px] ">
                Email
              </label>
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
              />
              <div className="text-red-500 text-end text-[13px]">
                {errors.email?.message}
              </div>
            </div>
            <DialogFooter className="mt-3">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Hủy
                </Button>
              </DialogClose>
              <Button variant="default" type="submit">
                Lưu
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
