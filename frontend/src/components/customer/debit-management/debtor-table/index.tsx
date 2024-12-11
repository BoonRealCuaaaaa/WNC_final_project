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
import { getReceivedDebitApi } from "@/api/debits.api";
import { useQuery } from "@tanstack/react-query";

const DebtorTable = () => {
   const { data: debits, isLoading: isFetchingDebits } = useQuery({
      queryKey: ["debit-creditor"],
      queryFn: getReceivedDebitApi,
   });

   console.log(debits)

   const columns = [
      {
         title: "Chủ nợ",
         dataIndex: "fullName",
         key: "fullName",
         render: (_, record) => (
            <div className="flex space-x-3 items-center">
               <Avatar
                  style={{
                     backgroundColor: "orange",
                     verticalAlign: "middle",
                  }}>
                  {record.fullName.charAt(0)}
               </Avatar>
               <div>
                  <div>{record.fullName}</div>
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
                              <div>{`Thanh toán nợ với với ${record.fullName} số tiền ${formatCurrency(
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
                              <div>{`Bạn có chắc chắn muốn hủy nợ với ${record.fullName} không?`}</div>
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

   if (isFetchingDebits) {
      return <div>Loading...</div>;
   }

   return (
      <div className="w-full border rounded-lg flex flex-col p-4 space-y-5">
         <div className="flex flex-row justify-between items-center">
            <div>
               <p className="font-semibold">Danh sách nhắc nợ người khác gửi</p>
               <p className="text-primary-gray">{debits.data.length} nhắc nợ</p>
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
            dataSource={debits.data
               .filter((item) => item?.fullName?.toLowerCase().includes(searchText.toLowerCase()))
               .map((item) => ({ ...item, key: item.id }))}
         />
      </div>
   );
};

export default DebtorTable;
