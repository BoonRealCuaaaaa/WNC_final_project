import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const OtpForm: React.FC = () => {
  const [email] = useState("test@gmail.com");
  const [codes, setCodes] = useState(["", "", "", "", "", ""]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      // Move focus to the next field if value is entered
      if (value && index < codes.length - 1) {
        const nextInput = document.getElementById(`input-${index + 1}`);
        if (nextInput) (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleResendCode = () => {
    console.log("Resend code clicked!");
  };

  return (
    <div className="border-2 border-dashed flex flex-col border-gray-300 p-6 max-w-md mx-auto text-center rounded-lg">
      {/* First Code Input Row */}
      <div className="flex justify-center gap-2 mb-4">
        {codes.map((code, index) => (
          <input
            key={index}
            id={`input-${index}`}
            type="text"
            value={code}
            onChange={(e) => handleInputChange(index, e.target.value)}
            maxLength={1}
            className="w-10 h-10 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ))}
      </div>
      {/* Instruction Text */}
      <p className="text-sm text-gray-700 mb-4">
        Nhập mã xác thực được gửi đến email <span className="font-semibold">{email}</span> của bạn
      </p>
      {/* Resend Code Button */}
      <button
        onClick={handleResendCode}
        className="text-indigo-500 text-sm underline mb-4 hover:text-indigo-600"
      >
        Gửi lại mã xác thực
      </button>
      {/* Second Code Input Row */}
      <Button
        onClick={handleResendCode}
      >
        Gửi mã xác thực
      </Button>
    </div>
  );
};

export default OtpForm;
