import React, { useState } from 'react';

interface BankingConfirmationProps {
  recipientName: string;
  recipientAccountNumber: string;
  recipientBank: string;
  bankingAmount: string;
  fee: number;
  feeMethod: string;
  transactionId: number;
  bankingContent: string;
  onConfirm: (verificationCode: string) => void;
  onResendCode: () => void;
}

const BankingConfirmation: React.FC<BankingConfirmationProps> = ({
  recipientName,
  recipientAccountNumber,
  recipientBank,
  bankingAmount,
  fee,
  feeMethod,
  transactionId,
  bankingContent,
  onConfirm,
  onResendCode,
}) => {
  const [verificationCode, setVerificationCode] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = verificationCode.split('');
      newCode[index] = value;
      setVerificationCode(newCode.join(''));

      if (index < 5 && value !== '') {
        const nextInput = document.getElementById(`verification-input-${index + 1}`);
        if(nextInput) nextInput.focus();
      }
    }
  };

  const handleConfirm = () => {
    onConfirm(verificationCode);
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-[600px] mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Xác nhận chuyển tiền</h2>
      <p className="text-gray-700 mb-4 text-center">
        Vui lòng xác nhận lại thông tin giao dịch để tránh sai sót
      </p>

      <div className="mb-4 flex justify-between">
        <div className="flex flex-col justify-between mb-2">
          <span className="font-medium">Người nhận tiền:</span>
          <span className='font-semibold'>{recipientName}</span>
        </div>
        <div className="flex flex-col justify-between mb-2">
          <span className="font-medium">Số tài khoản:</span>
          <span className='font-semibold'>{recipientAccountNumber}</span>
        </div>
        <div className="flex flex-col justify-between">
          <span className="font-medium">Ngân hàng:</span>
          <span className='font-semibold'>{recipientBank === '' ? 'Nội bộ' : recipientBank}</span>
        </div>
      </div>

      <hr />

      <div className="my-4 flex justify-between">
        <div className="flex flex-col justify-between mb-2">
          <span className="font-medium">Số tiền chuyển:</span>
          <span className='font-semibold'>{Number(bankingAmount).toLocaleString()}đ</span>
        </div>
        <div className="flex flex-col justify-between mb-2">
          <span className="font-medium">Phí giao dịch:</span>
          <span className='font-semibold'>{fee.toLocaleString()}đ {feeMethod !== 'sender' ? 'người gửi trả' : 'người nhận trả'}</span>
        </div>
        <div className="flex flex-col justify-between">
          <span className="font-medium">Phí giao dịch:</span>
          <span className='font-semibold'>{fee.toLocaleString()}đ</span>
        </div>
      </div>

      <hr />

      <div className="my-4">
        <span className="font-medium">Nội dung chuyển tiền:</span>
        <p>{bankingContent}</p>
      </div>

      <div className="flex space-x-2 mb-4 justify-center">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            id={`verification-input-${index}`}
            type="text"
            maxLength={1}
            className="w-10 h-12 border border-gray-300 rounded text-center text-xl focus:ring-2 focus:ring-blue-500"
            value={verificationCode[index] || ''}
            onChange={(e) => handleInputChange(e, index)}
          />
        ))}
      </div>
      {/* <p className="text-gray-700 text-center mb-4">
        Nhập mã xác thực được gửi đến email <span className="font-medium">{email}</span> của bạn
      </p> */}

      <div className='text-center mb-4'>
        <button type="button" onClick={onResendCode} className="text-blue-500 hover:underline">
          Gửi lại mã xác thực
        </button>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
        disabled={verificationCode.length !== 6}
      >
        Xác nhận
      </button>
    </div>
  );
};

export default BankingConfirmation;