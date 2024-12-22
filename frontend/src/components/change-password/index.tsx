import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import { changePasswordApi } from "@/api/customer.api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type FormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>();

  const { mutate: changePassword, status } = useMutation({
    mutationFn: changePasswordApi,
    onSuccess: () => {
      navigate("/account-management");
      toast({
        title: "Thành công",
        description: "Đổi mật khẩu thành công",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error?.message || "Đã xảy ra lỗi, vui lòng thử lại",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      });
      return;
    }

    changePassword({
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Đổi mật khẩu
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-gray-600 mb-1">
              Mật khẩu hiện tại
            </label>
            <Controller
              name="currentPassword"
              control={control}
              rules={{ required: "Vui lòng nhập mật khẩu hiện tại!" }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Nhập mật khẩu hiện tại"
                  className={`${
                    errors.currentPassword ? "border-red-500" : ""
                  }`}
                />
              )}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Mật khẩu mới</label>
            <Controller
              name="newPassword"
              control={control}
              rules={{
                required: "Vui lòng nhập mật khẩu mới!",
                // minLength: {
                //   value: 6,
                //   message: "Mật khẩu mới phải có ít nhất 6 ký tự!",
                // },
              }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Nhập mật khẩu mới"
                  className={`${errors.newPassword ? "border-red-500" : ""}`}
                />
              )}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                validate: (value) =>
                  value === getValues("newPassword") ||
                  "Mật khẩu xác nhận không khớp!",
              }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Xác nhận mật khẩu mới"
                  className={`${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            variant="default"
            type="submit"
            className="w-full"
            disabled={status === "pending"}
          >
            {status === "pending" ? "Đang xử lý..." : "Đổi mật khẩu"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
