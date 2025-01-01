import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { Modal } from "antd";
import { Button } from "@/components/ui/button";

type CreateCustomerFormData = {
  username: string;
  password: string;
  fullName: string;
  phone: string;
  email: string;
};

import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrorsImpl,
  UseFormClearErrors,
  useWatch,
  Control,
} from "react-hook-form";
import PasswordStrengthIndicator from "@/components/ui/password-strength-indicator";

interface CreateCustomerModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateCustomerFormData) => void;
  register: UseFormRegister<CreateCustomerFormData>;
  handleSubmit: UseFormHandleSubmit<CreateCustomerFormData>;
  errors: FieldErrorsImpl<CreateCustomerFormData>;
  clearErrors: UseFormClearErrors<CreateCustomerFormData>;
  resetForm: () => void;
  control: Control<CreateCustomerFormData>;
}

const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  register,
  handleSubmit,
  errors,
  control,
}) => {
  const password = useWatch({ control, name: "password" });
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Modal
      title={<div className="text-xl">Tạo tài khoản khách hàng</div>}
      open={visible}
      footer={null}
      onCancel={onCancel}
    >
      <Form.Root
        className="w-full flex flex-col space-y-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Form.Field name="username">
          <Form.Label className="text-sm font-medium leading-8">
            Tên đăng nhập <span className="text-red-600 font-bold">*</span>
          </Form.Label>
          <Form.Control asChild>
            <input
              className="h-9 w-full inline-flex justify-center items-center px-2 border border-gray-300 rounded-lg"
              type="text"
              placeholder="Nhập tên đăng nhập..."
              autoComplete="off"
              {...register("username", {
                required: "Tên đăng nhập là bắt buộc",
              })}
            />
          </Form.Control>
          <div className="flex justify-between my-1">
            {errors.username && (
              <Form.Message className="text-red-500 text-sm">
                {errors.username.message}
              </Form.Message>
            )}
          </div>
        </Form.Field>

        <Form.Field name="password">
          <Form.Label className="text-sm font-medium leading-8">
            Mật khẩu <span className="text-red-600 font-bold">*</span>
          </Form.Label>
          <Form.Control asChild>
            <div className="relative">
              <input
                className="h-9 w-full inline-flex justify-center items-center px-2 border border-gray-300 rounded-lg"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu..."
                autoComplete="new-password"
                {...register("password", {
                  required: "Mật khẩu là bắt buộc",
                  minLength: {
                    value: 8,
                    message: "Mật khẩu phải ít nhất 8 ký tự",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d).+$/,
                    message: "Mật khẩu phải chứa ít nhất một chữ hoa và một số",
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </Form.Control>
          <div className="flex justify-between my-1">
            {errors.password && (
              <Form.Message className="text-red-500 text-sm">
                {errors.password.message}
              </Form.Message>
            )}
          </div>
          <PasswordStrengthIndicator password={password} />
        </Form.Field>

        <Form.Field name="fullName">
          <Form.Label className="text-sm font-medium leading-8">
            Họ và tên <span className="text-red-600 font-bold">*</span>
          </Form.Label>
          <Form.Control asChild>
            <input
              className="h-9 w-full inline-flex justify-center items-center px-2 border border-gray-300 rounded-lg"
              type="text"
              placeholder="Nhập họ và tên đầy đủ..."
              {...register("fullName", {
                required: "Họ và tên là bắt buộc",
              })}
            />
          </Form.Control>
          <div className="flex justify-between my-1">
            {errors.fullName && (
              <Form.Message className="text-red-500 text-sm">
                {errors.fullName.message}
              </Form.Message>
            )}
          </div>
        </Form.Field>
        <Form.Field name="phoneNumber">
          <Form.Label className="text-sm font-medium leading-8">
            Số điện thoại <span className="text-red-600 font-bold">*</span>
          </Form.Label>
          <Form.Control asChild>
            <input
              className="h-9 w-full inline-flex justify-center items-center px-2 border border-gray-300 rounded-lg"
              type="tel"
              placeholder="Nhập số điện thoại..."
              {...register("phone", {
                required: "Số điện thoại là bắt buộc",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              })}
            />
          </Form.Control>
          <div className="flex justify-between my-1">
            {errors.phone && (
              <Form.Message className="text-red-500 text-sm">
                {errors.phone.message}
              </Form.Message>
            )}
          </div>
        </Form.Field>
        <Form.Field name="email">
          <Form.Label className="text-sm font-medium leading-8">
            Địa chỉ email <span className="text-red-600 font-bold">*</span>
          </Form.Label>
          <Form.Control asChild>
            <input
              className="h-9 w-full inline-flex justify-center items-center px-2 border border-gray-300 rounded-lg"
              type="email"
              placeholder="Nhập địa chỉ email..."
              {...register("email", {
                required: "Địa chỉ email là bắt buộc",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Địa chỉ email không hợp lệ",
                },
              })}
            />
          </Form.Control>
          <div className="flex justify-between my-1">
            {errors.email && (
              <Form.Message className="text-red-500 text-sm">
                {errors.email.message}
              </Form.Message>
            )}
          </div>
        </Form.Field>
        <div className="flex justify-end">
          <Form.Submit asChild>
            <Button variant="default" className="h-10">
              Tạo tài khoản
            </Button>
          </Form.Submit>
        </div>
      </Form.Root>
    </Modal>
  );
};

export default CreateCustomerModal;
