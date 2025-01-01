import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCustomerApi,
  depositCustomerApi,
  getAllCustomerApi,
} from "@/api/teller.api";
import { Avatar, Table, Input, Button as AntdButton } from "antd";
import { Button } from "@/components/ui/button";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  DollarOutlined,
  HistoryOutlined,
  SyncOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import DepositModal from "./deposit-modal";
import CreateCustomerModal from "./create-customer-modal";
import {
  formatCardNumber,
  formatPhoneNumber,
  thoudsandsSeparator,
} from "@/lib/string";
// Define Types
interface User {
  username: string;
}

interface Customer {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  user: User;
}

export interface CustomerResponse {
  id: number;
  accountNumber: string;
  customer: Customer;
  balance: number;
}

const CustomerManagement = () => {
  const {
    data: customers,
    isLoading,
    refetch: reFetchCustomers,
  } = useQuery<CustomerResponse[]>({
    queryKey: ["all-customers"],
    queryFn: () => getAllCustomerApi().then((res) => res.data),
  });
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerResponse | null>(null);

  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isCreateAccountModalVisible, setIsCreateAccountModalVisible] =
    useState(false);
  const [beneficiaryType, setBeneficiaryType] = useState<
    "username" | "accountNumber"
  >("username");
  const {
    register: registerDeposit,
    handleSubmit: handleSubmitDeposit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
    reset: resetDepositForm,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      beneficiaryAccount: "",
      depositAmount: "",
    },
  });

  const { mutate: depositCustomer } = useMutation({
    mutationFn: depositCustomerApi,
    onSuccess: (response) => {
      resetDepositForm();
      setIsDepositModalVisible(false);
      toast({
        title: `Nạp tiền vào tài khoản ${response?.data?.account.accountNumber} thành công`,
        description: "Bạn đã nạp tiền thành công",
      });
      reFetchCustomers();
      setSelectedCustomer(null);
    },
  });

  const onDepositSubmit = async (data) => {
    console.log(data.beneficiaryAccount);
    if (data.beneficiaryAccount === "") {
      setError("beneficiaryAccount", {
        type: "manual",
        message: "Không được để trống",
      });
      return;
    }
    if (beneficiaryType === "username") {
      data.beneficiaryAccount = customers.find(
        (item) => item.customer.user.username === data.beneficiaryAccount
      )?.accountNumber;
    }
    if (beneficiaryType === "accountNumber") {
      data.beneficiaryAccount = customers.find(
        (item) => item.accountNumber === data.beneficiaryAccount
      )?.accountNumber;
    }
    if (!data.beneficiaryAccount) {
      setError("beneficiaryAccount", {
        type: "manual",
        message: "Tài khoản không tồn tại",
      });
      return;
    }

    depositCustomer({
      accountNumber: data.beneficiaryAccount,
      amount: data.depositAmount,
    });
  };

  const {
    register: registerCreateAccount,
    handleSubmit: handleSubmitCreateAccount,
    setError: setCreateAccountError,
    clearErrors: clearCreateAccountErrors,
    formState: { errors: createAccountErrors },
    reset: resetCreateAccountForm,
    control, // Added control
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      phone: "",
      email: "",
    },
  });

  const { mutate: createCustomer } = useMutation({
    mutationFn: createCustomerApi,
    onSuccess: () => {
      resetCreateAccountForm();
      setIsCreateAccountModalVisible(false);
      toast({
        title: "Tạo tài khoản thành công",
        description: "Bạn đã tạo tài khoản thành công",
      });
      reFetchCustomers();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      if (error.response?.data.message === "Username already exists") {
        setCreateAccountError("username", {
          type: "manual",
          message: "Tên đăng nhập đã tồn tại",
        });
      }
      if (error.response?.data.message === "Email already exists") {
        setCreateAccountError("email", {
          type: "manual",
          message: "Email đã tồn tại",
        });
      }
      if (error.response?.data.message === "Username and email already exist") {
        setCreateAccountError("username", {
          type: "manual",
          message: "Tên đăng nhập đã tồn tại",
        });
        setCreateAccountError("email", {
          type: "manual",
          message: "Email đã tồn tại",
        });
      }
      if (!error.response?.data) {
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi tạo tài khoản",
        });
        resetCreateAccountForm();
        setIsCreateAccountModalVisible(false);
      }
    },
  });

  const onCreateAccountSubmit = (data: {
    username: string;
    password: string;
    fullName: string;
    phone: string;
    email: string;
  }) => {
    createCustomer(data);
    resetCreateAccountForm();
  };

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  if (isLoading) return <SyncOutlined spin />;

  const columns = [
    {
      title: "Thông tin khách hàng",
      dataIndex: ["customer", "fullName"],
      key: "fullName",
      render: (_, record) => (
        <div className="flex space-x-3 items-center">
          <Avatar
            style={{
              backgroundColor: "orange",
              verticalAlign: "middle",
            }}
          >
            {record.customer.fullName.charAt(0)}
          </Avatar>
          <div>
            <div>{record.customer.fullName}</div>
            <div style={{ color: "gray", fontSize: "12px" }}>
              {formatCardNumber(record.accountNumber)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Username",
      dataIndex: ["customer", "user", "username"],
      key: "username",
      render: (text) => (
        <div className="flex items-center space-x-1">
          <UserOutlined />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: ["customer", "phone"],
      key: "phone",
      render: (text) => (
        <div className="flex items-center space-x-1">
          <PhoneOutlined />
          <span>{formatPhoneNumber(text)}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: ["customer", "email"],
      key: "email",
      render: (text) => (
        <div className="flex items-center space-x-1">
          <MailOutlined />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Số dư",
      dataIndex: "balance",
      key: "balance",
      render: (text) => (
        <div className="flex items-center space-x-1">
          <DollarOutlined />
          <span>{thoudsandsSeparator(text)}</span>
        </div>
      ),
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <BankOutlined onClick={() => handleAccountDeposit(record)} />
          <HistoryOutlined
            onClick={() =>
              navigate(`/teller/transactions/${record.customer.id}`)
            }
          />
        </div>
      ),
    },
  ];

  const handleAccountDeposit = (record: CustomerResponse) => {
    setSelectedCustomer(record);
    setIsDepositModalVisible(true);
    setValue("beneficiaryAccount", record.accountNumber);
    setBeneficiaryType("accountNumber");
  };

  const filteredCustomers = customers.filter(
    (item: CustomerResponse) =>
      item?.customer?.fullName
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      item?.customer?.user?.username
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      item?.customer?.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
      item?.customer?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      item?.accountNumber?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="w-full border rounded-lg flex flex-col p-4 space-y-5">
      <div className="flex flex-row justify-between items-center">
        <div>
          <p className="font-semibold">Danh sách khách hàng</p>
          <p className="text-gray-500">{filteredCustomers.length} khách hàng</p>
        </div>
        <div className="space-x-2">
          <AntdButton
            className="bg-white text-black"
            onClick={() => {
              setIsDepositModalVisible(true);
            }}
          >
            Nạp tiền
          </AntdButton>
          <DepositModal
            visible={isDepositModalVisible}
            onCancel={() => {
              setIsDepositModalVisible(false);
              setSelectedCustomer(null);
              resetDepositForm();
            }}
            onSubmit={onDepositSubmit}
            selectedCustomer={selectedCustomer}
            beneficiaryType={beneficiaryType}
            setBeneficiaryType={setBeneficiaryType}
            register={registerDeposit}
            handleSubmit={handleSubmitDeposit}
            errors={errors}
            clearErrors={clearErrors}
          />
          <Button
            onClick={() => {
              setIsCreateAccountModalVisible(true);
            }}
          >
            Tạo tài khoản khách hàng
          </Button>
          <CreateCustomerModal
            visible={isCreateAccountModalVisible}
            onCancel={() => {
              setIsCreateAccountModalVisible(false);
              resetCreateAccountForm();
              clearCreateAccountErrors();
            }}
            onSubmit={onCreateAccountSubmit}
            register={registerCreateAccount}
            handleSubmit={handleSubmitCreateAccount}
            errors={createAccountErrors}
            clearErrors={clearCreateAccountErrors}
            resetForm={resetCreateAccountForm}
            control={control}
          />
        </div>
      </div>
      <Input
        className="w-64"
        placeholder="Tìm kiếm..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
      />
      <Table
        dataSource={filteredCustomers.map((item: CustomerResponse) => ({
          ...item,
          key: item.id,
        }))}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default CustomerManagement;
