import { Button } from "@/components/shared/button";
import { Input } from "antd";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const TellerTab = () => {
   const recaptcha = useRef();

   return (
      <div className="flex flex-col space-y-6 my-6 ">
         <Input placeholder="Email..." />
         <Input placeholder="Mật khẩu..." />
         <div className="flex justify-center mb-4">
            <ReCAPTCHA
               ref={recaptcha}
               sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} // Thay YOUR_RECAPTCHA_SITE_KEY bằng khóa của bạn
               size="normal"
            />
         </div>
         <Button>Đăng nhập</Button>
      </div>
   );
};

export default TellerTab;
