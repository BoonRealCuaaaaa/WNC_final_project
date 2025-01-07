import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreditorTable from "./creditor-table";
import DebtorTable from "./debtor-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const DebitManagement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("payDebit") ? "debtor" : "creditor"
  );

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    // Xóa query param khi chuyển tab
    navigate({
      pathname: location.pathname, // Giữ nguyên pathname hiện tại
      search: "", // Xóa query params
    });
  };

  useEffect(() => {
    // Khi searchParams thay đổi, cập nhật lại activeTab
    const payDebit = searchParams.get("payDebit");
    setActiveTab(payDebit ? "debtor" : "creditor");
  }, [searchParams]); // Theo dõi sự thay đổi của searchParams

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="creditor">Do bạn tạo</TabsTrigger>
        <TabsTrigger value="debtor">Người khác gửi</TabsTrigger>
      </TabsList>
      <TabsContent value="creditor">
        <CreditorTable />
      </TabsContent>
      <TabsContent value="debtor">
        <DebtorTable />
      </TabsContent>
    </Tabs>
  );
};
