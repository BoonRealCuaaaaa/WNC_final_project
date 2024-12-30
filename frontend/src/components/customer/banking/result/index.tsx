import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "react-bootstrap-icons";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { createBeneficiaryApi } from "@/api/beneficiaries.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";


const BankingResult = ({
  receiverName,
  amount,
  desBankName,
  desAccount
}: {
  receiverName: string;
  amount: number;
  desBankName: string;
  desAccount: string;
}) => {
  const [isSaved, setIsSaved] = useState(true);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setIsSaved(!isSaved);
  };

  const { mutate: mutateCreateBeneficiary } = useMutation({
    mutationFn: createBeneficiaryApi,
    onSuccess: (response) => {
      if (response.status === 201) {
        toast({
          variant: "default",
          title: "Thêm người thụ hưởng thành công",
        });
      }
    },
    onError: (error: AxiosError) => {

      const message = (error.response?.data as { message: string }).message;

      toast({
        variant: "destructive",
        title: "Thêm người thụ hưởng thất bại",
        description: message,
      });
    },
  });

  const handleButtonClick = () => {
    if (isSaved) {
      mutateCreateBeneficiary({ bankName: desBankName, accountNumber: desAccount, remindName: receiverName });
    }
    
    navigate("/account-management");
  };

  return (
    <div className="w-[700px] mx-auto bg-white p-6 rounded-lg border-gray-300 border text-center">
      {/* Title */}
      <h1 className="text-xl font-bold text-gray-800 mb-2 text-left">
        Kết quả chuyển tiền
      </h1>
      {/* Subtitle */}
      <p className="text-sm text-gray-500 mb-6 text-left">
        Vui lòng xác nhận lại thông tin giao dịch để tránh sai sót
      </p>
      <div className="flex justify-center">
        <Check className="text-green-400 text-7xl" />
      </div>
      {/* Success Message */}
      <h2 className="text-lg font-semibold text-green-500 mb-1">
        CHUYỂN TIỀN THÀNH CÔNG
      </h2>
      <p className="text-gray-600 mb-6">
        {receiverName} đã nhận được {amount}đ từ bạn
      </p>
      {/* Checkbox */}
      <div className="flex items-center justify-center mb-6">
        <input
          type="checkbox"
          id="save-info"
          checked={isSaved}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
        />
        <label htmlFor="save-info" className="ml-2 text-sm text-gray-600">
          Lưu lại thông tin người nhận cho lần giao dịch kế
        </label>
      </div>
      {/* Back Button */}

      <Button
        variant="outline-primary"
        className="w-full"
        onClick={handleButtonClick}
      >
        Quay về trang quản lý tài khoản
      </Button>
    </div>
  );
};

export default BankingResult;
