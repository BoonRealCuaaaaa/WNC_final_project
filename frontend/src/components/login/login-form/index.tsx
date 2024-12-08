import { Tabs, TabsContent, TabsList, TabsTrigger } from "@src/components/shared/tabs";
import CustomerTab from "./tabs/customer-tab";
import TellerTab from "./tabs/teller-tab";
import AdminTab from "./tabs/admin-tab";

const LoginTabs = () => {
   return (
      <div className="flex flex-col justify-center items-center w-1/2">
         <p className="text-2xl font-semibold py-6">Đăng nhập</p>
         <Tabs defaultValue="customer">
            <TabsList className="grid w-full grid-cols-3 ">
               <TabsTrigger value="customer">
                  <p className="font-medium">Khách hàng</p>
               </TabsTrigger>
               <TabsTrigger value="teller">
                  <p className="font-medium">Giao dịch viên</p>
               </TabsTrigger>
               <TabsTrigger value="admin">
                  <p className="font-medium">Quản trị viên</p>
               </TabsTrigger>
            </TabsList>
            <TabsContent value="customer">
               <CustomerTab />
            </TabsContent>
            <TabsContent value="teller">
               <TellerTab />
            </TabsContent>
            <TabsContent value="admin">
               <AdminTab />
            </TabsContent>
         </Tabs>
      </div>
   );
};

export default LoginTabs;
