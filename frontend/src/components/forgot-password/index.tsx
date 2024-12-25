import { useState } from "react";

import { Link } from "react-router-dom";
import ForgotPasswordInputEmail from "./input-email";
import ForgotPasswordInputOtp from "./input-otp";
import ForgotPasswordInputPassword from "./input-password";
import BackToLogin from "./back-to-login";
import { Toaster } from "../shared/toaster";

const ForgotPassword = () => {
  const [email,setEmail] = useState("");
  const [step, setStep] = useState(0);
  return (
    <div className="flex flex-col justify-center items-center w-1/2 font-medium"> 
      {/* Button góc trên bên phải */}
      <Link to="/auth/login" className="fixed top-4 right-4 px-4 py-2 text-sm">
        Đăng nhập
      </Link>
      {step == 0 && <ForgotPasswordInputEmail setStep={setStep} setEmail={setEmail} />}
      {step == 1 && <ForgotPasswordInputOtp setStep={setStep} email={email} />}
      {step == 2 && <ForgotPasswordInputPassword setStep={setStep} email={email} />}
      {step == 3 && <BackToLogin setStep={setStep} />}
    </div>
  );
};

export default ForgotPassword;
