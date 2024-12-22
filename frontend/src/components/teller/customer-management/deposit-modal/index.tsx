import React from "react";
import * as Form from "@radix-ui/react-form";
import { Modal, Radio } from "antd";
import { Button } from "@/components/ui/button";
import { UseFormRegister, UseFormHandleSubmit, FieldErrorsImpl, UseFormClearErrors } from "react-hook-form";
import { CustomerResponse } from "..";

type DepositFormData = {
  beneficiaryAccount: string;
  depositAmount: string;
};

type BeneficiaryType = "username" | "accountNumber";

interface DepositModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: DepositFormData) => void;
  selectedCustomer: CustomerResponse | null;
  beneficiaryType: BeneficiaryType;
  setBeneficiaryType: (type: BeneficiaryType) => void;
  register: UseFormRegister<DepositFormData>;
  handleSubmit: UseFormHandleSubmit<DepositFormData>;
  errors: FieldErrorsImpl<DepositFormData>;
  clearErrors: UseFormClearErrors<DepositFormData>;
}

const DepositModal: React.FC<DepositModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  selectedCustomer,
  beneficiaryType,
  setBeneficiaryType,
  register,
  handleSubmit,
  errors,
  clearErrors,
}) => {
  return (
    <Modal
      title={<div className="text-xl">Nạp tiền vào tài khoản</div>}
      open={visible}
      footer={null}
      onCancel={onCancel}
    >
      <Form.Root
        className="w-full flex flex-col space-y-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        {selectedCustomer ? (
          <>
            <Form.Field name="username">
              <Form.Label className="text-sm font-medium leading-8">
                Tên đăng nhập
              </Form.Label>
              <Form.Control asChild>
                <input
                  className="h-9 w-full px-2 border border-gray-300 rounded-lg"
                  type="text"
                  value={selectedCustomer.customer.user.username}
                  readOnly
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="accountNumber">
              <Form.Label className="text-sm font-medium leading-8">
                Số tài khoản
              </Form.Label>
              <Form.Control asChild>
                <input
                  className="h-9 w-full px-2 border border-gray-300 rounded-lg"
                  type="text"
                  value={selectedCustomer.accountNumber}
                  {...register("beneficiaryAccount", {
                    value: selectedCustomer.accountNumber,
                  })}
                  readOnly
                />
              </Form.Control>
            </Form.Field>
          </>
        ) : (
          <Form.Field name="beneficiaryAccount">
            <div className="flex justify-between items-center">
              <Form.Label className="text-sm font-medium leading-8">
                Người thụ hưởng{" "}
                <span className="text-red-600 font-bold">*</span>
              </Form.Label>
              <div className="flex items-center space-x-4">
                <Radio.Group
                  onChange={(e) => setBeneficiaryType(e.target.value)}
                  value={beneficiaryType}
                >
                  <Radio value="username">Tên đăng nhập</Radio>
                  <Radio value="accountNumber">Số tài khoản</Radio>
                </Radio.Group>
              </div>
            </div>
            <Form.Control asChild>
              <input
                className="h-9 w-full inline-flex justify-center items-center px-2 border border-gray-300 rounded-lg"
                type="text"
                placeholder={
                  beneficiaryType === "username"
                    ? "Nhập tên đăng nhập..."
                    : "Nhập số tài khoản người thụ hưởng..."
                }
                {...register("beneficiaryAccount")}
                onChange={() => {
                  clearErrors("beneficiaryAccount");
                }}
              />
            </Form.Control>
            <div className="flex justify-between my-1">
              {errors.beneficiaryAccount && (
                <Form.Message className="text-red-500 text-sm">
                  {errors.beneficiaryAccount.message}
                </Form.Message>
              )}
              <Form.Message
                className="text-red-500 text-sm"
                match="valueMissing"
              >
                Không được để trống
              </Form.Message>
            </div>
          </Form.Field>
        )}
        <Form.Field name="depositAmount">
          <Form.Label className="text-sm font-medium leading-8">
            Số tiền nạp <span className="text-red-600 font-bold">*</span>
          </Form.Label>
          <Form.Control asChild>
            <input
              className="h-9 w-full inline-flex justify-center items-center px-2 border border-gray-300 rounded-lg"
              type="number"
              required
              placeholder="Nhập số tiền nạp..."
              min="1"
              {...register("depositAmount")}
            />
          </Form.Control>
          <div className="flex justify-between my-1">
            <Form.Message className="text-red-500 text-sm" match="valueMissing">
              Không được để trống
            </Form.Message>
          </div>
        </Form.Field>

        <div className="flex justify-end">
          <Form.Submit asChild>
            <Button variant="default" className="h-10 ">
              Nạp tiền
            </Button>
          </Form.Submit>
        </div>
      </Form.Root>
    </Modal>
  );
};

export default DepositModal;
