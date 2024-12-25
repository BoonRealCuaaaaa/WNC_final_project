import React from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
}) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[@$!%*?&#]/.test(password)) strength += 1;
    return strength;
  };

  const strength = getStrength();
  const strengthLabel = ["Yếu", "Trung bình", "Mạnh", "Rất mạnh"];
  const strengthColor = ["red", "orange", "yellow", "green"];
  const colorClasses = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-400",
  ];
  return (
    <div className="mt-2">
      <div className="w-full bg-gray-200 h-2 rounded">
        <div
          className={`h-full ${
            colorClasses[strength - 1]
          } transition-all duration-300 rounded`}
          style={{ width: `${(strength / 4) * 100}%` }}
        ></div>
      </div>
      {password && (
        <span className={`text-${strengthColor[strength - 1]}-500 text-sm`}>
          {strengthLabel[strength - 1]}
        </span>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
