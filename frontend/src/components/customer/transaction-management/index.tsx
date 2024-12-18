import { useQuery } from "@tanstack/react-query";
import { getPaymentHistoryApi } from "@/api/customer.api";
import { formatCurrency } from "@/shared/lib/utils/format-currency";
import { Avatar, Table, Input, Tag } from "antd";
import { useState } from "react";

interface Transaction {
  id: string;
  type: string;
  relatedPerson: string;
  accountNumber: string;
  amount: number;
  createdAt: string;
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
              {record.accountNumber}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => (
        <span
          className={
            record.type === "Nhận tiền" ? "text-purple-500" : "text-red-500"
          }
        >
          {record.type === "Nhận tiền" ? "+" : "-"}
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (createdAt: string) => {
        const date = new Date(createdAt);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}, ${date.getHours()}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")} ${date.getHours() >= 12 ? "PM" : "AM"}`;
        return formattedDate;
      },
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(transactions.data);
  return (
    <div className="w-full border rounded-lg flex flex-col p-4 space-y-5">
      <div className="flex flex-row justify-between items-center">
        <div>
          <p className="font-semibold">Lịch sử giao dịch</p>
          <p className="text-gray-500">{transactions.data.length} giao dịch</p>
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
        dataSource={transactions.data
          .filter((item: Transaction) =>
            item?.relatedPerson
              ?.toLowerCase()
              .includes(searchText.toLowerCase())
          )
          .map((item: Transaction) => ({ ...item, key: item.id }))}
        columns={columns}
      />
    </div>
  );
};

export default PaymentTransactionManagement;
