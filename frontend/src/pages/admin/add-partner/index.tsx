import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import TextArea from "antd/es/input/TextArea";
import { addPartnerApi } from "@/api/admin.api";

type FormData = {
  bankName: string;
  domain: string;
  partnerPublicKey: string;
  ourPrivateKey: string;
  ourPublicKey: string;
};

const AddPartnerPage = () => {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const { mutate: addPartner } = useMutation({
    mutationFn: addPartnerApi,
    onSuccess: () => {
      reset();
      toast({
        title: "Thành công",
        description: "Thêm đối tác thành công",
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
    addPartner(data);
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <Card className="p-6 w-full max-w-md shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Thêm đối tác
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-600 mb-1">
                Tên ngân hàng đối tác
              </label>
              <Controller
                name="bankName"
                control={control}
                rules={{ required: "Vui lòng nhập tên ngân hàng đối tác" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập tên ngân hàng đối tác"
                    className={`${errors.bankName ? "border-red-500" : ""}`}
                  />
                )}
              />
              {errors.bankName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bankName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Tên miền</label>
              <Controller
                name="domain"
                control={control}
                rules={{
                  required: "Vui lòng nhập tên miền",
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập mật khẩu mới"
                    className={`${errors.domain ? "border-red-500" : ""}`}
                  />
                )}
              />
              {errors.domain && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.domain.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-1">
                Public key của đối tác
              </label>
              <Controller
                name="partnerPublicKey"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="Nhập khóa công khai của ngân hàng đối tác"
                    className={`${
                      errors.partnerPublicKey ? "border-red-500" : ""
                    }`}
                  />
                )}
              />
              {errors.partnerPublicKey && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.partnerPublicKey.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-1">
                Private key của ngân hàng chúng tôi
              </label>
              <Controller
                name="ourPrivateKey"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="Nhập khóa bí mật của ngân hàng bản thân"
                    className={`${
                      errors.ourPrivateKey ? "border-red-500" : ""
                    } w-full`}
                  />
                )}
              />
              {errors.ourPrivateKey && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ourPrivateKey.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-1">
                Public key của ngân hàng chúng tôi
              </label>
              <Controller
                name="ourPublicKey"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="Nhập khóa công khai của ngân hàng bản thân"
                    className={`${
                      errors.ourPublicKey ? "border-red-500" : ""
                    } w-full`}
                  />
                )}
              />
              {errors.ourPublicKey && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ourPublicKey.message}
                </p>
              )}
            </div>

            <Button
              variant="default"
              type="submit"
              className="w-full"
              disabled={status === "pending"}
            >
              Thêm đối tác
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AddPartnerPage;
