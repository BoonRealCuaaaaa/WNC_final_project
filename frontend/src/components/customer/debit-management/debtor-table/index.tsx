import { Button } from "@/components/shared/button";
import { Avatar, Input, Steps, Table, Tag } from "antd";
import { CheckSquare, XLg } from "react-bootstrap-icons";

import {
   AlertDialog,
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
import { cancelDebitApi, generateDebitOtpApi, getReceivedDebitApi, payDebitApi } from "@/api/debits.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

const DebtorTable = () => {
   const { toast } = useToast();
   const [otp, setOtp] = useState("");
   const [openPaymentModal, setOpenPaymentModal] = useState(false);
   const [openCancelModal, setOpenCancelModal] = useState(false);
   const {
      data: debits,
      isLoading: isFetchingDebits,
      refetch: refetchDebits,
   } = useQuery({
      queryKey: ["debit-creditor"],
      queryFn: getReceivedDebitApi,
   });

   const { mutate: generateOtp } = useMutation({ mutationFn: generateDebitOtpApi });
   const { mutate: payDebit } = useMutation({
      mutationFn: payDebitApi,
      onSuccess: () => {
         refetchDebits();
         setOtp("");
         toast({
            title: "Thanh toán nợ thành công",
            description: "Bạn đã thanh toán nợ thành công",
         });
         setOpenPaymentModal(false);
      },
      onError: () => {
         toast({
            title: "Thanh toán nợ thất bại",
            description: "Bạn đã thanh toán nợ thất bại",
            variant: "destructive",
         });
      },
   });

   const { mutate: cancelDebit } = useMutation({
      mutationFn: cancelDebitApi,
      onSuccess: () => {
         refetchDebits();
         setValueCancel("cancelReason", "");
         toast({
            title: "Hủy nhắc nợ thành công",
            description: "Bạn đã hủy nhắc nợ thành công",
         });
      },
   });

   const {
      register: registerCancel,
      handleSubmit: handleSubmitCancel,
      setValue: setValueCancel,
   } = useForm({
      defaultValues: {
         id: "",
         cancelReason: "",
      },
   });

   const onDeleteDebit = (data) => {
      cancelDebit({ debitId: data.id, cancelReason: data.cancelReason });
   };

   const [currentStep, setCurrentStep] = useState(0);

   const handlePayDebit = (debitId) => {
      if (otp.length < 6) {
         toast({
            title: "Lỗi",
            description: "Vui lòng nhập đủ 6 số OTP",
            variant: "destructive",
         });
         return;
      }

      payDebit({ debitId, otp });
   };

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
         render: (_, record) =>
            record.status == "Chưa thanh toán" && (
               <div className="flex justify-start">
                  <AlertDialog open={openPaymentModal} onOpenChange={setOpenPaymentModal}>
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
                                 <Steps current={currentStep} direction="horizontal">
                                    <Steps.Step title="Thông tin nhắc nợ" />
                                    <Steps.Step title="Xác thực OTP" />
                                 </Steps>
                                 {currentStep === 0 && (
                                    <div className="flex flex-col space-y-3 ">
                                       <div className="self-center">
                                          {`Xác nhận thanh toán nợ với ${record.fullName}, số tiền ${formatCurrency(
                                             record.amount
                                          )}`}
                                       </div>
                                    </div>
                                 )}

                                 {currentStep === 1 && (
                                    <div className="flex flex-col space-y-5">
                                       <div className="self-center">{`Nhập OTP để xác thực thanh toán nợ với với ${
                                          record.fullName
                                       } số tiền ${formatCurrency(record.amount)}`}</div>
                                       <div className="w-full flex justify-center self-center">
                                          <Input.OTP
                                             onInput={(text) => {
                                                console.log(text);
                                                setOtp(text.join(""));
                                             }}
                                          />
                                       </div>
                                    </div>
                                 )}
                              </div>
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                           <AlertDialogCancel
                              onClick={() => {
                                 setCurrentStep(0);
                              }}>
                              Cancel
                           </AlertDialogCancel>
                           {currentStep === 0 ? (
                              <Button
                                 onClick={() => {
                                    generateOtp({ debitId: record.id });
                                    setCurrentStep(1);
                                 }}>
                                 Tiếp tục
                              </Button>
                           ) : (
                              <Button
                                 onClick={() => {
                                    handlePayDebit(record.id);
                                 }}>
                                 Hoàn tất
                              </Button>
                           )}
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog open={openCancelModal} onOpenChange={setOpenCancelModal}>
                     <AlertDialogTrigger asChild>
                        <Button variant="ghost">
                           <XLg />
                        </Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>Hủy nhắc nợ </AlertDialogTitle>
                           <AlertDialogDescription asChild>
                              <form onSubmit={handleSubmitCancel((data) => onDeleteDebit({ ...data, id: record.id }))}>
                                 <div className="flex flex-col space-y-5">
                                    <div>{`Bạn có chắc chắn muốn hủy nhắc nợ với ${record.fullName} không?`}</div>
                                    <textarea
                                       className="border border-gray-300 inline-flex h-20 w-full resize-none appearance-none items-center justify-center rounded-lg p-2.5 text-[15px] leading-none outline-none focus:shadow-[0_0_0_2px_black]"
                                       required
                                       placeholder="Nhập lý do nhắc nợ"
                                       {...registerCancel("cancelReason")}
                                    />
                                 </div>
                                 <AlertDialogFooter className="mt-5">
                                    <AlertDialogCancel>Trở về</AlertDialogCancel>
                                    <Button type="submit">Hủy nhác nợ</Button>
                                 </AlertDialogFooter>
                              </form>
                           </AlertDialogDescription>
                        </AlertDialogHeader>
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
