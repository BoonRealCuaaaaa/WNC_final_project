import { Button } from "@/components/shared/button";
import { useNavigate } from "react-router-dom";

const BackToLogin = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <p className="text-2xl font-semibold">Đổi mật khẩu thành công</p>
      <p className="text-[#6b7280] text-sm mt-1">
        Tài khoản test@gmail.com đã được đổi mật khẩu thành công
      </p>
      <div className=" space-y-6 my-6 flex flex-col w-1/3">
        <Button
          onClick={() => {
            props.setStep(0);
            navigate("/auth/login");
          }}
        >
          Quay lại trang đăng nhập
        </Button>
      </div>
    </>
  );
};

export default BackToLogin;
