import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreditorTable from "./creditor-table";
import DebtorTable from "./debtor-table";
import { useSearchParams } from "react-router-dom";

export const DebitManagement = () => {
  const [searchParams] = useSearchParams();
  const payDebit = searchParams.get("payDebit");
  return (
    <Tabs defaultValue={payDebit ? "debtor" : "creditor"}>
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
