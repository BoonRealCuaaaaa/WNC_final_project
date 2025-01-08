import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "react-bootstrap-icons";
import { Button } from "@/components/ui/button";
import useAppStore from "@/store";


export default function BankingResult() {
  const [isSaved, setIsSaved] = useState(true);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setIsSaved(!isSaved);
  };

  const { paymentTransaction, resetPaymentTransaction, saveForNextBanking} = useAppStore((state) => state);

  const handleButtonClick = () => {
    if (isSaved) saveForNextBanking();
    else resetPaymentTransaction();
    
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
        {paymentTransaction.desOwner} đã nhận được {paymentTransaction.amount}đ từ bạn
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
