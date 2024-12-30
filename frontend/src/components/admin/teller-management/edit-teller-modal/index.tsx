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
    reValidateMode: "onChange",
    defaultValues: {
      username: teller.username,
      fullName: teller.fullName,
      email: teller.email,
      phone: teller.phone,
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px] gap-0">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa giao dịch viên</DialogTitle>
        </DialogHeader>
        <div className="grid py-4">
          <form
            className="w-full flex flex-col gap-2"
            onSubmit={handleSubmit((data) => {
              console.log(data);
              handleEdit(teller.id, data);
            })}
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
                required
              />
              <div className="text-red-500 text-end text-[13px]">
                {errors.username?.message}
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
                required
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
                required
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
                required
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
