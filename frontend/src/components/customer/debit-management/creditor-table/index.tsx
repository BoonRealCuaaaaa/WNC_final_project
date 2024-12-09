import { Button } from "@/components/shared/button";
import { Avatar, Input, Table, Tag, List, Modal } from "antd";
import * as Form from "@radix-ui/react-form";
import { PersonBadge, XLg } from "react-bootstrap-icons";
import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { formatCurrency } from "@/shared/lib/utils/format-currency";

const data = [
   {
      key: "1",
      name: "Nguyễn Văn A",
      accountNumber: "1234-5678-9012-3456",
      amount: 170000,
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

const beneficiaries = [
   { id: 1, name: "Nguyễn Văn A", account: "1234-5678-91" },
   { id: 2, name: "Trần Thị B", account: "9876-5432-1098-7654" },
   { id: 3, name: "Lê Văn C", account: "1357-2468-1357-2468" },
];

const CreditorTable = () => {
   const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
   const [selectedPerson, setSelectedPerson] = useState(null);
   const [isOpenBeneficiaryModal, setIsOpenBeneficiaryModal] = useState(false);
   const [searchText, setSearchText] = useState("");

   const { register, watch, setValue } = useForm({
      defaultValues: {
         debtorAccount: "",
         debtAmount: "",
         content: "",
      },
   });

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
         render: (amount) => formatCurrency(amount),
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
            <AlertDialog>
               <AlertDialogTrigger asChild>
                  <Button variant="ghost">
                     <XLg />
                  </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>Hủy nhắc nợ </AlertDialogTitle>
                     <AlertDialogDescription asChild>
                        <div className="flex flex-col space-y-5">
                           <div>{`Bạn có chắc chắn muốn hủy nhắc nợ với ${record.name} không?`}</div>
                           <textarea
                              className=" border border-gray-300 inline-flex  h-20 w-full resize-none appearance-none items-center justify-center rounded-lg  p-2.5 text-[15px] leading-none outline-none focus:shadow-[0_0_0_2px_black]"
                              required
                              placeholder="Nhập lý do nhắc nợ"
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
         ),
      },
   ];

   const handleSelect = (person) => {
      setSelectedPerson(person);
   };

   return (
      <div className="w-full border rounded-lg flex flex-col p-4 space-y-5">
         <div className="flex flex-row justify-between items-center">
            <div>
               <p className="font-semibold">Danh sách nhắc nợ do bạn tạo</p>
               <p className="text-primary-gray">{data.length} nhắc nợ</p>
            </div>
            <Button
               onClick={() => {
                  setIsCreateModalVisible(true);
               }}>
               Tạo nhắc nợ
            </Button>
            <Modal
               title={<div className="text-xl">Tạo nhắc nợ</div>}
               open={isCreateModalVisible}
               onCancel={() => {
                  setIsCreateModalVisible(false);
               }}
               footer={null}>
               <Form.Root className="w-full flex flex-col space-y-2">
                  <Form.Field name="debtor-account">
                     <Form.Label className="text-sm font-medium leading-8 ">
                        Người nợ <span className="text-red-600 font-bold">*</span>
                     </Form.Label>
                     <div className="flex space-x-3 items-center">
                        <Form.Control asChild>
                           <input
                              className="h-9 w-full inline-flex justify-center items-center px-2 border border-gray-300  leading-none rounded-lg "
                              type="text"
                              required
                              placeholder="Nhập số tài khoản người nợ"
                              maxLength={255}
                              value={watch("debtorAccount")}
                              {...register("debtorAccount")}
                           />
                        </Form.Control>
                        <div
                           className="border p-2 rounded-lg hover:border-gray-400 w-12 flex justify-center"
                           onClick={() => {
                              setIsOpenBeneficiaryModal(true);
                           }}>
                           <PersonBadge className="text-lg" />
                        </div>
                     </div>
                     <div className="flex justify-between my-1">
                        <Form.Message className="text-red-500 text-sm" match="valueMissing">
                           Không được để trống
                        </Form.Message>
                     </div>
                  </Form.Field>
                  <Form.Field name="template-description">
                     <Form.Label className="text-base font-medium leading-8 ">
                        Số tiền nợ <span className="text-red-600 font-bold">*</span>
                     </Form.Label>
                     <Form.Control asChild>
                        <input
                           className="h-9 w-full inline-flex justify-center items-center px-2 border border-gray-300 rounded-lg leading-none  "
                           type="text"
                           required
                           placeholder="Nhập số tiền nợ"
                           value={watch("debtAmount")}
                           {...register("debtAmount")}
                        />
                     </Form.Control>
                     <div className="flex justify-between my-1">
                        <Form.Message className="text-red-500 text-sm" match="valueMissing">
                           Không được để trống
                        </Form.Message>
                     </div>
                  </Form.Field>
                  <Form.Field name="template-template">
                     <Form.Label className="text-base font-medium leading-8 ">
                        Nội dung <span className="text-red-600 font-bold">*</span>
                     </Form.Label>
                     <Form.Control asChild>
                        <textarea
                           className=" border border-gray-300 inline-flex  h-20 w-full resize-none appearance-none items-center justify-center rounded-lg  p-2.5 text-[15px] leading-none outline-none focus:shadow-[0_0_0_2px_black]"
                           required
                           placeholder="Nhập nội dung nhắc nợ"
                           value={watch("content")}
                           {...register("content")}
                        />
                     </Form.Control>
                     <div className="flex justify-between my-1">
                        <Form.Message className="text-red-500 text-sm" match="valueMissing">
                           Không được để trống
                        </Form.Message>
                     </div>
                  </Form.Field>
                  <div className="flex justify-end ">
                     <Form.Submit asChild>
                        <Button variant="default" className="h-10 ">
                           Tạo nhắc nợ
                        </Button>
                     </Form.Submit>
                  </div>
               </Form.Root>
            </Modal>
            <Modal
               title="Chọn người nợ"
               open={isOpenBeneficiaryModal}
               footer={null}
               onCancel={() => {
                  setIsOpenBeneficiaryModal(false);
               }}>
               <List
                  itemLayout="horizontal"
                  dataSource={beneficiaries}
                  renderItem={(item) => (
                     <List.Item
                        onClick={() => {
                           handleSelect(item);
                           setValue("debtorAccount", item.account);
                           setIsOpenBeneficiaryModal(false);
                        }}
                        className={`cursor-pointer ${selectedPerson?.id === item.id ? "bg-gray-100" : ""}`}>
                        <List.Item.Meta
                           avatar={<Avatar size="large">{item.name.charAt(0)}</Avatar>}
                           title={item.name}
                           description={item.account}
                        />
                     </List.Item>
                  )}
               />
            </Modal>
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

export default CreditorTable;
