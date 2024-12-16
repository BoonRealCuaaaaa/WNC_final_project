import { resetPasswordApi } from "@/api/auth.api";
import { Button } from "@/components/shared/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Input } from "antd";
import { useForm, Controller } from "react-hook-form";

const ForgotPasswordInputPassword = (props) => {
  const { toast } = useToast();
  const { control, handleSubmit } = useForm();
  const { mutate: resetPassword } = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      props.setStep((prev) => prev + 1);
    },
  });

  const onHandleSubmmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Mật khẩu không khớp",
        description: "Mật khẩu mới và xác nhận mật khẩu không khớp",
        variant: "destructive",
      });
    }

    resetPassword({ email: props.email, password: data.newPassword });
  };

  return (
    <>
      <p className="text-2xl font-semibold">Đổi mật khẩu</p>
      <p className="text-[#6b7280] text-sm mt-1">
        Nhập mật khẩu mới bạn mong muốn
      </p>
      <div className=" space-y-6 my-6 flex flex-col w-1/3">
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <Input placeholder="Nhập mật khẩu mới..." {...field} />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input placeholder="Xác nhận mật khẩu mới..." {...field} />
          )}
        />
        <Button onClick={handleSubmit(onHandleSubmmit)}>Đổi mật khẩu</Button>
      </div>
    </>
  );
};

export default ForgotPasswordInputPassword;
