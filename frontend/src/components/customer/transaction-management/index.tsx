import { useQuery } from "@tanstack/react-query";
import { getPaymentHistoryApi } from "@/api/customer.api";
import { formatCurrency } from "@/shared/lib/utils/format-currency";
import { Avatar, Table, Input, Tag } from "antd";
import { useState } from "react";
import { SortOrder } from "antd/es/table/interface";
import { formatBankAccountNumber } from "@/lib/string";
import { formatDate } from "@/lib/time";

interface Transaction {
  id: string;
  type: string;
  relatedPerson: string;
  accountNumber: string;
  amount: number;
  createdAt: string;
  receive: boolean;
}
const PaymentTransactionManagement = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["payment-transactions"],
    queryFn: getPaymentHistoryApi,
  });

  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "Loại thanh toán",
      dataIndex: "type",
      key: "type",
      filters: [
        {
          text: "Thanh toán nhắc nợ",
          value: "Thanh toán nhắc nợ",
        },
        {
          text: "Chuyển khoản",
          value: "Chuyển khoản",
        },
        {
          text: "Nhận tiền",
          value: "Nhận tiền",
        },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => {
        let color = "";
        switch (type) {
          case "Thanh toán nhắc nợ":
            color = "red";
            break;
          case "Chuyển khoản":
            color = "yellow";
            break;
          case "Nhận tiền":
            color = "purple";
            break;
          default:
            color = "blue";
        }
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Người liên quan",
      dataIndex: "relatedPerson",
      key: "relatedPerson",
      render: (_, record) => (
        <div className="flex space-x-3 items-center">
          <Avatar
            style={{
              backgroundColor: "orange",
              verticalAlign: "middle",
            }}
          >
            {record.relatedPerson.charAt(0)}
          </Avatar>
          <div>
            <div>{record.relatedPerson}</div>
            <div style={{ color: "gray", fontSize: "12px" }}>
              {formatBankAccountNumber(record.accountNumber)}{" "}
              {record.relatedBank !== import.meta.env.VITE_BANK_NAME && (
                <Tag>{record.relatedBank}</Tag>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount, record) => (
        <span
          className={
            record.receive === false ? "text-purple-500" : "text-red-500"
          }
        >
          {record.receive === false ? "+" : "-"}
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      defaultSortOrder: "descend" as SortOrder,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (createdAt: string) => formatDate(createdAt),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // Extract the filtered transactions to a variable to avoid duplication

  const filteredTransactions = transactions.data.filter(
    (item: Transaction) =>
      item?.relatedPerson?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.accountNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="w-full border rounded-lg flex flex-col p-4 space-y-5">
      <div className="flex flex-row justify-between items-center">
        <div>
          <p className="font-semibold">Lịch sử giao dịch</p>
          <p className="text-gray-500 text-sm">
            *Chỉ hiển thị các giao dịch trong vòng 30 ngày
          </p>
          <p className="text-gray-500">
            {filteredTransactions.length} giao dịch
          </p>
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
        dataSource={filteredTransactions.map((item: Transaction) => ({
          ...item,
          key: item.id,
        }))}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default PaymentTransactionManagement;
