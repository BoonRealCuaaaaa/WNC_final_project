import { Button } from "@/components/shared/button";
import { Avatar, Input, Table, Tag } from "antd";
import { CheckSquare, XLg } from "react-bootstrap-icons";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/shared/alert-dialog";
import { useState } from "react";
import { formatCurrency } from "@/shared/lib/utils/format-currency";


const data = [
   {
      key: "1",
      name: "Nguyễn Văn A",
      accountNumber: "1234-5678-9012-3456",
      amount: 170000, // Dữ liệu là số
      status: "Chưa thanh toán",
      description: "Đây là một nhắc nợ được tạo bởi tôi, đây là mô tả siêu siêu dài...",
   },
   {
      key: "2",
      name: "Nguyễn Văn B",
      accountNumber: "9876-5432-1098-7654",
      amount: 200000,
      status: "Đã thanh toán",
      description: "Đây là một nhắc nợ khác.",
   },
   {
      key: "3",
      name: "Nguyễn Văn C",
      accountNumber: "1357-2468-1357-2468",
      amount: 150000,
      status: "Chưa thanh toán",
      description: "Mô tả khác.",
   },
];

const DebtorTable = () => {


   const columns = [
      {
         title: "Người nợ",
         dataIndex: "name",
         key: "name",
         render: (_, record) => (
            <div className="flex space-x-3 items-center">
               <Avatar
                  style={{
                     backgroundColor: "orange",
                     verticalAlign: "middle",
                  }}>
                  {record.name.charAt(0)}
               </Avatar>
               <div>
                  <div>{record.name}</div>
                  <div style={{ color: "gray", fontSize: "12px" }}>{record.accountNumber}</div>
               </div>
            </div>
         ),
      },
      {
         title: "Số tiền",
         dataIndex: "amount",
         key: "amount",
         sorter: (a, b) => a.amount - b.amount,
         render: (amount) => formatCurrency(amount), // Render số tiền theo định dạng
      },
      {
         title: "Trạng thái",
         dataIndex: "status",
         key: "status",
         filters: [
            {
               text: "Đã thanh toán",
               value: "Đã thanh toán",
            },
            {
               text: "Chưa thanh toán",
               value: "Chưa thanh toán",
            },
         ],
         onFilter: (value, record) => record.status === value,
         render: (status) => <Tag color={status === "Chưa thanh toán" ? "red" : "green"}>{status}</Tag>,
      },
      {
         title: "Mô tả",
         dataIndex: "description",
         key: "description",
         ellipsis: true,
      },
      {
         title: "Hành động",
         key: "action",
         render: (_, record) => (
            <div className="flex justify-start">
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="ghost" className="p-0">
                        <CheckSquare />
                     </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle>Thanh toán nợ</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                           <div className="flex flex-col space-y-5">
                              <div>{`Thanh toán nợ với với ${record.name} số tiền ${formatCurrency(
                                 record.amount
                              )}`}</div>
                              <div className="w-3/4 flex justify-center self-center">
                                 <Input.OTP />
                              </div>
                           </div>
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>

               <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="ghost">
                        <XLg />
                     </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle>
                           <span>Hủy nhắc nợ </span>
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                           <div className="flex flex-col space-y-5">
                              <div>{`Bạn có chắc chắn muốn hủy nợ với ${record.name} không?`}</div>
                              <textarea
                                 className=" border border-gray-300 inline-flex  h-20 w-full resize-none appearance-none items-center justify-center rounded-lg  p-2.5 text-[15px] leading-none outline-none focus:shadow-[0_0_0_2px_black]"
                                 required
                                 placeholder="Nhập lý do hủy nợ"
                              />
                           </div>
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>
            </div>
         ),
      },
   ];

   const [searchText, setSearchText] = useState("");

   return (
      <div className="w-full border rounded-lg flex flex-col p-4 space-y-5">
         <div className="flex flex-row justify-between items-center">
            <div>
               <p className="font-semibold">Danh sách nhắc nợ người khác gửi</p>
               <p className="text-primary-gray">{data.length} nhắc nợ</p>
            </div>
         </div>
         <Input
            className="w-64"
            placeholder="Lọc..."
            value={searchText}
            onChange={(e) => {
               setSearchText(e.target.value);
            }}
         />
         <Table
            columns={columns}
            dataSource={data.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))}
         />
      </div>
   );
};

export default DebtorTable;
