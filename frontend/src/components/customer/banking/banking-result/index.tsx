import React, { useState } from "react";
import { Link } from "react-router-dom";

const BankingResult: React.FC = () => {
  const [isSaved, setIsSaved] = useState(true);

  const handleCheckboxChange = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div className="w-[700px] mx-auto bg-white p-6 rounded-lg shadow-md text-center">
      {/* Title */}
      <h1 className="text-xl font-bold text-gray-800 mb-2">Kết quả chuyển tiền</h1>
      {/* Subtitle */}
      <p className="text-sm text-gray-500 mb-6">
        Vui lòng xác nhận lại thông tin giao dịch để tránh sai sót
      </p>
      {/* Success Icon */}
      <div className="flex justify-center items-center mb-4">
        
      </div>
      {/* Success Message */}
      <h2 className="text-lg font-semibold text-green-500 mb-1">CHUYỂN TIỀN THÀNH CÔNG</h2>
      <p className="text-gray-600 mb-6">Nguyễn Văn A đã nhận được 170.000đ từ bạn</p>
      {/* Checkbox */}
      <div className="flex items-center justify-center mb-6">
        <input
          type="checkbox"
          id="save-info"
          checked={isSaved}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="save-info" className="ml-2 text-sm text-gray-600">
          Lưu lại thông tin người nhận cho lần giao dịch kế
        </label>
      </div>
      {/* Back Button */}
      <Link
        to="/account-management"
        className="px-6 py-2 text-indigo-500 border border-indigo-500 rounded-lg hover:bg-indigo-50"
      >
        Quay về trang quản lý tài khoản
      </Link>
    </div>
  );
};

export default BankingResult;
