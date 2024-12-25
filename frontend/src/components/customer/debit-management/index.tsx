import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreditorTable from "./creditor-table";
import DebtorTable from "./debtor-table";

export const DebitManagement = () => {
   return (
      <Tabs defaultValue="creditor">
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
