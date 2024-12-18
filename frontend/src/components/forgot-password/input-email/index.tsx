import { generateForgotPasswordOtpApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Input } from "antd";
import { useForm, Controller } from "react-hook-form";

const ForgotPasswordInputEmail = (props) => {
  const { toast } = useToast();
  const { control, handleSubmit, watch } = useForm();
  const { mutate: mutateSendEmail } = useMutation({
    mutationFn: generateForgotPasswordOtpApi,
    onSuccess: () => {
      props.setEmail(watch("email"));
      props.setStep((prev) => prev + 1);
    },
    onError: () => {
      toast({
        title: "Email không tồn tại",
        description: "Vui lòng nhập lại email",
        variant: "destructive",
      });
    },
  });

  const handleEmailSubmit = (data) => {
    mutateSendEmail(data.email);
  };
  return (
    <>
      <p className="text-2xl font-semibold">Đổi mật khẩu</p>
      <p className="text-[#6b7280] text-sm mt-1">
        Nhập địa chỉ email cần đổi mật khẩu, chúng tôi sẽ gửi một mã xác thực
        đến email đó
      </p>
      <div className=" space-y-6 my-6 flex flex-col w-1/3">
        <Controller
          name="email"
          control={control}
          render={({ field }) => <Input placeholder="Email..." {...field} />}
        />
        <Button onClick={handleSubmit(handleEmailSubmit)}>
          Lấy mã xác thực
        </Button>
      </div>
    </>
  );
};

export default ForgotPasswordInputEmail;
