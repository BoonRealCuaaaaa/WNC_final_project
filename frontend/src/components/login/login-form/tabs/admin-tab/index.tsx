import { Button } from "@/components/ui/button";
import { Input } from "antd";


const AdminTab = () => {
   return (
      <div className="flex flex-col space-y-6 my-6 ">
         <Input placeholder="Mã Admin..." />
         <Button>Đăng nhập</Button>
      </div>
   );
};

export default AdminTab;
