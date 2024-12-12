import { Button } from "@/components/shared/button";
import { Avatar, Input, Table, Tag, List, Modal } from "antd";
import * as Form from "@radix-ui/react-form";
import { PersonBadge, Search, XLg } from "react-bootstrap-icons";
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
import { createDebitApi, getCreatedDebitApi } from "@/api/debits.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { checkExistApi } from "@/api/customer.api";
import { getBeneficiariesApi } from "@/api/beneficiaries.api";

const CreditorTable = () => {
   const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
   const [selectedPerson, setSelectedPerson] = useState(null);
   const [isOpenBeneficiaryModal, setIsOpenBeneficiaryModal] = useState(false);
   const [searchText, setSearchText] = useState("");
   const { toast } = useToast();

   const { mutate: createDebit } = useMutation({
      mutationFn: createDebitApi,
      onSuccess: () => {
         setIsCreateModalVisible(false);
         toast({
            title: "Tạo nhắc nợ thành công",
            description: "Bạn đã tạo nhắc nợ thành công",
         });
         reFetchDebits();
      },
   });

   const { mutate: checkExist } = useMutation({
      mutationFn: checkExistApi,
      onSuccess: (response) => {
         console.log(response);
         setValue("debtName", response.data.fullName);
         toast({
            title: "Tìm kiếm thành công",
            description: "Số tài khoản hợp lệ",
         });
      },
      onError: () => {
         toast({
            title: "Tìm kiếm thất bại",
            description: "Số tài khoản không hợp lệ",
            variant: "destructive",
         });
      },
   });

   const {
      data: debits,
      isLoading: isFetchingDebits,
      refetch: reFetchDebits,
   } = useQuery({
      queryKey: ["debit-creditor"],
      queryFn: getCreatedDebitApi,
   });

   const { data: beneficiaries } = useQuery({
      queryKey: ["beneficiaries"],
      queryFn: getBeneficiariesApi,
   });


   const { register, watch, handleSubmit, setValue } = useForm({
      defaultValues: {
         debtorAccount: "",
         debtAmount: "",
         debtName: "",
         content: "",
      },
   });

   const onCreateDebit = (data) => {
      const { debtorAccount, debtAmount, content } = data;
      createDebit({ accountNumber: debtorAccount, amount: debtAmount, content });
   };

   const onSearchDebtor = (event) => {
      event.preventDefault();
      const accountNumber = watch("debtorAccount");
      checkExist(accountNumber);
   };

   const columns = [
      {
         title: "Người nợ",
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
         dataIndex: "content",
         key: "content",
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
                           <div>{`Bạn có chắc chắn muốn hủy nhắc nợ với ${record.fullName} không?`}</div>
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

   if (isFetchingDebits) return <div>Loading...</div>;

   return (
      <div className="w-full border rounded-lg flex flex-col p-4 space-y-5">
         <div className="flex flex-row justify-between items-center">
            <div>
               <p className="font-semibold">Danh sách nhắc nợ do bạn tạo</p>
               <p className="text-primary-gray">{debits.data.length} nhắc nợ</p>
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
               <Form.Root className="w-full flex flex-col space-y-2" onSubmit={handleSubmit(onCreateDebit)}>
                  <Form.Field name="debtor-account">
                     <Form.Label className="text-sm font-medium leading-8 ">
                        Số tài khoản người nợ <span className="text-red-600 font-bold">*</span>
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
                        <button
                           className="border p-2 rounded-lg hover:border-gray-400 w-12 flex justify-center"
                           onClick={onSearchDebtor}>
                           <Search className="text-lg" />
                        </button>
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
                     <Form.Label className="text-sm font-medium leading-8 ">
                        Tên người nợ <span className="text-red-600 font-bold">*</span>
                     </Form.Label>
                     <Form.Control asChild>
                        <input
                           className="h-9 w-full inline-flex justify-center items-center px-2 border border-gray-300 rounded-lg leading-none  "
                           type="text"
                           required
                           placeholder="Nhập số tiền nợ"
                           value={watch("debtName")}
                           {...register("debtName")}
                           disabled
                        />
                     </Form.Control>
                     <div className="flex justify-between my-1">
                        <Form.Message className="text-red-500 text-sm" match="valueMissing">
                           Không được để trống
                        </Form.Message>
                     </div>
                  </Form.Field>
                  <Form.Field name="template-description">
                     <Form.Label className="text-sm font-medium leading-8 ">
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
                     <Form.Label className="text-sm font-medium leading-8 ">
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
                  dataSource={beneficiaries.data}
                  renderItem={(item: { id: number; name: string; accountNumber: string }) => (
                     <List.Item
                        onClick={() => {
                           handleSelect(item);
                           setValue("debtorAccount", item.accountNumber);
                           setValue("debtName", item.name);
                           setIsOpenBeneficiaryModal(false);
                        }}
                        className={`cursor-pointer ${selectedPerson?.id === item.id ? "bg-gray-100" : ""}`}>
                        <List.Item.Meta
                           avatar={<Avatar size="large">{item.name.charAt(0)}</Avatar>}
                           title={item.name}
                           description={item.accountNumber}
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
            dataSource={debits.data
               .filter((item) => item?.fullName?.toLowerCase().includes(searchText.toLowerCase()))
               .map((item) => ({ ...item, key: item.id }))}
         />
      </div>
   );
};

export default CreditorTable;
