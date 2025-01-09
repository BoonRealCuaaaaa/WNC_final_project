import { Description } from "@/components/ui/description";
import BeneficiaryList from "./beneficiary-list";
import CreditCard from "./credit-card";
import { Button } from "@/components/ui/button";
import { getName } from "@/lib/string";
import { useNavigate } from "react-router-dom";

export function AccountManagement() {
  const navigate = useNavigate();

  const handleBankingNowButton = () => {
    navigate("/banking");
  }

  return (
    <div className="flex gap-x-8 h-full">
      <div className="w-[340px] min-w-[340px] flex flex-col gap-y-4">
        <div>
          <span className="font-bold text-2xl tracking-tight">
            Xin chào, {getName("Nguyen Van A")}
          </span>
          <Description className="text-base">
            Chào mừng bạn đến với ngân hàng ABC
          </Description>
        </div>
        <CreditCard />
        <Button variant="outline-primary" onClick={handleBankingNowButton}>Chuyển khoản ngay</Button>
      </div>
      <BeneficiaryList />
    </div>
  );
}
