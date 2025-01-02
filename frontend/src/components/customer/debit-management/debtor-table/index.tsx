import { Avatar, Input, Table, Tag } from "antd";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/shared/lib/utils/format-currency";
import { getReceivedDebitApi } from "@/api/debits.api";
import { useQuery } from "@tanstack/react-query";

import PaymentDialog from "./payment-dialog";
import CancelDialog from "./cancel-dialog";
import { useLocation, useSearchParams } from "react-router-dom";

const DebtorTable = () => {
  const {
    data: debits,
    isLoading: isFetchingDebits,
    refetch: refetchDebits,
  } = useQuery({
    queryKey: ["debit-creditor"],
    queryFn: getReceivedDebitApi,
  });

  const location = useLocation();

  const [payDebit, setPayDebit] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setPayDebit(searchParams.get("payDebit"));
    console.log("HEHE");
  }, [location.search, searchParams, payDebit]);

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
            }}
          >
            {record.fullName.charAt(0)}
          </Avatar>
          <div>
            <div>{record.fullName}</div>
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
      render: (status) => (
        <Tag color={status === "Chưa thanh toán" ? "red" : "green"}>
          {status}
        </Tag>
      ),
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
      render: (_, record) =>
        record.status == "Chưa thanh toán" && (
          <div className="flex justify-start space-x-3">
            <PaymentDialog
              record={record}
              refetchDebits={refetchDebits}
              preOpen={payDebit == record.id}
            />
            <CancelDialog record={record} refetchDebits={refetchDebits} />
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
          .filter((item) =>
            item?.fullName?.toLowerCase().includes(searchText.toLowerCase())
          )
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .map((item) => ({ ...item, key: item.id }))}
        key={payDebit}
      />
    </div>
  );
};

export default DebtorTable;
