import { verifyForgotPasswordOtpApi } from "@/api/auth.api";
import { Button } from "@/components/shared/button";
import { useMutation } from "@tanstack/react-query";
import { Input } from "antd";
import { useForm, Controller } from "react-hook-form";

const ForgotPasswordInputOtp = (props) => {
  const { control, handleSubmit } = useForm();
  const { mutate: mutateSendOtp } = useMutation({
    mutationFn: verifyForgotPasswordOtpApi,
    onSuccess: () => {
      props.setStep((prev) => prev + 1);
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    mutateSendOtp({ email: props.email, otp: data.otp });
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
          Nhập mã xác thực được gửi đến email test@gmail.com của bạn
        </div>
        <p className="text-[#7c3aed] text-sm font-normal self-center">
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
