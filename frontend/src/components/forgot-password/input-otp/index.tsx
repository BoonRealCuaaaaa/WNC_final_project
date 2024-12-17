import {
  generateForgotPasswordOtpApi,
  verifyForgotPasswordOtpApi,
} from "@/api/auth.api";
import { Button } from "@/components/shared/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Input } from "antd";
import { useForm, Controller } from "react-hook-form";

const ForgotPasswordInputOtp = (props) => {
  const { toast } = useToast();
  const { control, handleSubmit } = useForm();
  const { mutate: mutateSendOtp } = useMutation({
    mutationFn: verifyForgotPasswordOtpApi,
    onSuccess: () => {
      props.setStep((prev) => prev + 1);
    },
    onError: () => {
      toast({
        title: "Mã OTP không đúng",
        description: "Vui lòng nhập lại mã OTP",
        variant: "destructive",
      });
    },
  });

  const { mutate: resendOtp } = useMutation({
    mutationFn: generateForgotPasswordOtpApi,
    onSuccess: () => {
      toast({
        title: "Gửi mã OTP thành công",
        description: "Vui lòng kiểm tra email",
      });
    },
    onError: () => {
      toast({
        title: "Gửi mã OTP thất bại",
        description: "Vui lòng thử lại",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    mutateSendOtp({ email: props.email, otp: data.otp });
  };

  const onResendOtp = () => {
    resendOtp({ email: props.email });
  };

  return (
    <>
      <p className="text-2xl font-semibold">Đổi mật khẩu</p>
      <p className="text-[#6b7280] text-sm mt-1">Nhập mã xác thực OTP</p>
      <div className=" space-y-[10px] mt-6 mb-3 flex flex-col w-full items-center">
        <Controller
          name="otp"
          control={control}
          render={({ field }) => <Input.OTP {...field} className="w-1/3 " />}
        />
        <div className="self-center text-sm">
          {`Nhập mã xác thực được gửi đến email `}
          <span className="font-bold">{props.email}</span>
          {` của bạn`}
        </div>
        <p
          className="text-[#7c3aed] text-sm font-normal self-center cursor-pointer"
          onClick={onResendOtp}
        >
          Gửi lại mã xác thực
        </p>
      </div>
      <div className="w-1/3">
        <Button className="w-full" onClick={handleSubmit(onSubmit)}>
          Xác nhận
        </Button>
      </div>
    </>
  );
};

export default ForgotPasswordInputOtp;
