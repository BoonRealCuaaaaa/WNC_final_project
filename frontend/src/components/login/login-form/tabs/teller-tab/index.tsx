import { loginApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  setAccessToken,
  setEmail,
  setRefreshToken,
  setRole,
  setUserName,
} from "@/utils/auth";
import { useMutation } from "@tanstack/react-query";
import { Input } from "antd";
import { AxiosError } from "axios";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CustomerTab = () => {
  const recaptcha = useRef<ReCAPTCHA | null>(null);
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm();
  const { toast } = useToast();
  const [usernameStatus, setUsernameStatus] = useState<
    "" | "error" | "warning"
  >("");
  const [passwordStatus, setPasswordStatus] = useState<
    "" | "error" | "warning"
  >("");

  const { mutate: mutateLogin } = useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      if (response.status === 200 && response.data.role === "TELLER") {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        setRole(response.data.role);
        setUserName(response.data.username);
        setEmail(response.data.email);
        navigate("/teller");
      }
    },
    onError: (error: AxiosError) => {
      const message = (error.response?.data as { message: string }).message;
      let translateMessage = "";

      switch (message) {
        case "User not found":
          translateMessage = "Tài khoản không tồn tại";
          break;
        case "Invalid password":
          translateMessage = "Mật khẩu không đúng";
          break;
        default:
          translateMessage = "Đã có lỗi xảy ra";
          break;
      }

      toast({
        variant: "destructive",
        title: "Lỗi",
        description: translateMessage,
      });
    },
  });

  const onLoginSubmit = (data) => {
    const capchaValue = recaptcha.current ? recaptcha.current.getValue() : "";

    if (!capchaValue) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng xác nhận bạn không phải là người máy",
      });
      return;
    }

    if (!data.username) {
      setUsernameStatus("error");
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Tên đăng nhập không được để trống",
      });

      return;
    }

    if (!data.password) {
      setPasswordStatus("error");
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Mật khẩu không được để trống",
      });

      return;
    }

    if (data.username && data.password) {
      mutateLogin(data);
    }
  };

  return (
    <div className="flex flex-col space-y-6 my-6 ">
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <Input
            status={usernameStatus}
            onInput={() => {
              setUsernameStatus("");
            }}
            placeholder="Tên đăng nhập..."
            {...field}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Input.Password
            onInput={() => {
              setPasswordStatus("");
            }}
            status={passwordStatus}
            placeholder="Mật khẩu..."
            {...field}
          />
        )}
      />
      <div className="flex justify-center">
        <ReCAPTCHA
          ref={recaptcha}
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} // Thay YOUR_RECAPTCHA_SITE_KEY bằng khóa của bạn
          size="normal"
          className="border-0"
        />
      </div>
      <Button onClick={handleSubmit(onLoginSubmit)}>Đăng nhập</Button>
    </div>
  );
};

export default CustomerTab;
