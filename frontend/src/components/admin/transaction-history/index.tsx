import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import avatarImage from "@/assets/avatar.jpg";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "antd";
import { useState } from "react";
import PaginationSection from "../pagination";
import { Transaction } from "@/types/transaction";
import { getAllTransactionsApi } from "@/api/admin.api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import DateRangePicker from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
// import { addDays } from "date-fns";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPartners } from "@/api/partner.api";

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "desAccount",
    accessorKey: "desAccount",
    header: "desAccount",
  },
  {
    id: "desBankName",
    accessorKey: "desBankName",
    header: "desBankName",
  },
  {
    id: "type",
    header: "type",
    cell: ({ row }) => {
      if (row.original.srcBankName === import.meta.env.VITE_BANK_NAME) {
        return (
          <div className="rounded-md flex justify-center items-center gap-x-4 border border-red-500 text-red-500">
            Chuyển khoản
          </div>
        );
      }
      return (
        <div className="rounded-md flex justify-center items-center gap-x-4 border border-purple-500 text-purple-500">
          Nhận tiền
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "id",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-1">#{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "info",
    header: "info",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-4">
        <Avatar>
          <AvatarImage src={avatarImage} />
        </Avatar>
        <div className="flex flex-col gap-y-1">
          {row.original.srcBankName === import.meta.env.VITE_BANK_NAME ? (
            <div>
            {row.original.desAccount}{" "}
            <span className="border px-2 rounded ml-3 font-semibold">
              {row.original.desBankName}
            </span>
          </div>
          ) : (
          <div>
            {row.original.srcAccount}{" "}
            <span className="border px-2 rounded ml-3 font-semibold border-blue-500 text-blue-500">
              {row.original.srcBankName}
            </span>
          </div>
          )}
          
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "amount",
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"));
      if (row.original.srcBankName === import.meta.env.VITE_BANK_NAME) {
        return <div className="text-red-500">-{amount}</div>;
      }
      return <div className="text-purple-500">+{amount}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "createdAt",
    cell: ({ row }) => {
      const formatDate = (date) => {
        return date
          .toLocaleString("en-US", {
            hour12: true, // Ensures AM/PM format
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC",
          })
          .replace(",", "");
      };

      return (
        <div className="font-medium">
          {formatDate(new Date(row.getValue("createdAt")))}
        </div>
      );
    },
  },
];
export default function TransactionHistory() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 1),
    to: new Date(),
  });

  const [bankName, setBankName] = useState("");

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", { from: date?.from, to: date?.to, bankName }],
    queryFn: async () => {
      const transactions = await getAllTransactionsApi({
        from: date.from,
        to: date.to,
        bankName: bankName === 'all' ? "" : bankName 
      });
      return transactions;
    },
    enabled: !!(date?.from || date?.to || bankName),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const { data: partners, isLoading: partnersIsLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => (await getPartners()).data,
    refetchOnWindowFocus: false,
  });

  const table = useReactTable({
    data: transactions || [],
    columns,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // needed for client-side global filtering
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter,
      rowSelection,
      pagination,
    },
    initialState: {
      globalFilter: "", // Set initial state if not managing globalFilter state
      columnVisibility: {
        desAccount: false,
        desBankName: false,
      },
    },
  });

  if (isLoading || partnersIsLoading) {
    return <h2>Loading...</h2>;
  }

  const currentPage =
    table.getPageCount() > 0 ? table.getState().pagination.pageIndex + 1 : 0;

  const totalAmount =
    !transactions || transactions?.length === 0
      ? 0
      : Math.floor(
          transactions.reduce(
            (a: number, b: Transaction) => a + Number(b.amount),
            0
          )
        );

  return (
    <div className="w-full border-2 p-6 rounded-lg">
      <div className="flex flex-row justify-between items-end">
        <div>
          <p className="font-semibold">
            Lịch sử giao dịch với các ngân hàng khác
          </p>
          <p className="text-gray-500">{transactions?.length || 0} giao dịch</p>
        </div>
        <div>
          <span className="text-gray-500">Tổng số tiền đã giao dịch:</span>
          <span className="text-purple-500 text-2xl">
            {totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex gap-x-3">
          <Input
            placeholder="Lọc..."
            value={globalFilter}
            onChange={(event) =>
              table.setGlobalFilter(String(event.target.value))
            }
            className="w-64 h-9"
          />
          <Select value={bankName} onValueChange={setBankName}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn ngân hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Tất cả</SelectItem>
                {partners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.bankName}>{partner.bankName}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <DateRangePicker date={date} setDate={setDate} />
      </div>
      <div>
        <Table className="border-spacing-y-5 border-separate">
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center bg-gray-100"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <PaginationSection
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
          handlePreviousPage={() => table.previousPage()}
          handleNextPage={() => table.nextPage()}
          handleFirstPage={() => table.firstPage()}
          handleLastPage={() => table.lastPage()}
          currentPage={currentPage}
          totalPage={table.getPageCount()}
        />
      </div>
    </div>
  );
}
