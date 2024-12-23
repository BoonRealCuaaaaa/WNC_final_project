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
import { useQuery } from "@tanstack/react-query";

// const transactions: Transaction[] = [
//   { id: 1, amount: 120.5, content: "Payment for invoice #1234", status: "Completed", srcAccount: "9876543210", srcBankName: "Bank A", desAccount: "1234567890", desBankName: "Bank B", createdAt: new Date('2024-12-01T10:15:30Z'), updatedAt: new Date('2024-12-02T12:20:30Z') },
//   { id: 2, amount: 2500, content: "Salary transfer", status: "Completed", srcAccount: "111122223333", srcBankName: "Bank C", desAccount: "999988887777", desBankName: "Bank D", createdAt: new Date('2024-11-30T08:00:00Z'), updatedAt: new Date('2024-12-01T09:00:00Z') },
//   { id: 3, amount: 75.75, content: "Gift payment", status: "Pending", srcAccount: "5678901234", srcBankName: "Bank E", desAccount: "4321098765", desBankName: "Bank F", createdAt: new Date('2024-12-02T14:45:00Z'), updatedAt: new Date('2024-12-02T16:00:00Z') },
//   { id: 4, amount: 300, content: "Utility bill payment", status: "Failed", srcAccount: "1029384756", srcBankName: "Bank G", desAccount: "6758493021", desBankName: "Bank H", createdAt: new Date('2024-12-01T11:15:45Z'), updatedAt: new Date('2024-12-01T11:45:00Z') },
//   { id: 5, amount: 1500, content: "Car loan installment", status: "Completed", srcAccount: "1122334455", srcBankName: "Bank I", desAccount: "6677889900", desBankName: "Bank J", createdAt: new Date('2024-11-29T09:30:00Z'), updatedAt: new Date('2024-11-29T10:00:00Z') },
//   { id: 6, amount: 50, content: "Charity donation", status: "Completed", srcAccount: "9988776655", srcBankName: "Bank K", desAccount: "5544332211", desBankName: "Bank L", createdAt: new Date('2024-12-03T07:00:00Z'), updatedAt: new Date('2024-12-03T08:00:00Z') },
//   { id: 7, amount: 890, content: "Purchase payment", status: "Pending", srcAccount: "4455667788", srcBankName: "Bank M", desAccount: "123443211234", desBankName: "Bank N", createdAt: new Date('2024-12-01T10:00:00Z'), updatedAt: new Date('2024-12-01T11:00:00Z') },
//   { id: 8, amount: 400, content: "Household maintenance", status: "Completed", srcAccount: "2233445566", srcBankName: "Bank O", desAccount: "8899776655", desBankName: "Bank P", createdAt: new Date('2024-12-02T08:30:00Z'), updatedAt: new Date('2024-12-02T09:00:00Z') },
//   { id: 9, amount: 220, content: "Subscription renewal", status: "Failed", srcAccount: "1010101010", srcBankName: "Bank Q", desAccount: "2020202020", desBankName: "Bank R", createdAt: new Date('2024-12-01T06:00:00Z'), updatedAt: new Date('2024-12-01T07:00:00Z') },
//   { id: 10, amount: 1299.99, content: "Online shopping", status: "Completed", srcAccount: "3030303030", srcBankName: "Bank S", desAccount: "4040404040", desBankName: "Bank T", createdAt: new Date('2024-12-03T10:10:00Z'), updatedAt: new Date('2024-12-03T11:10:00Z') },
//   { id: 11, amount: 480, content: "Freelance project payment", status: "Completed", srcAccount: "1111222233", srcBankName: "Bank U", desAccount: "3333444455", desBankName: "Bank V", createdAt: new Date('2024-11-30T15:45:00Z'), updatedAt: new Date('2024-11-30T16:15:00Z') },
//   { id: 12, amount: 32.5, content: "Coffee shop payment", status: "Pending", srcAccount: "6666777788", srcBankName: "Bank W", desAccount: "9999000011", desBankName: "Bank X", createdAt: new Date('2024-12-02T09:20:00Z'), updatedAt: new Date('2024-12-02T09:50:00Z') },
//   { id: 13, amount: 500, content: "Loan repayment", status: "Completed", srcAccount: "8888777766", srcBankName: "Bank Y", desAccount: "3333222211", desBankName: "Bank Z", createdAt: new Date('2024-11-29T18:30:00Z'), updatedAt: new Date('2024-11-29T19:00:00Z') },
//   { id: 14, amount: 350, content: "Gym membership", status: "Failed", srcAccount: "5656565656", srcBankName: "Bank AA", desAccount: "7878787878", desBankName: "Bank BB", createdAt: new Date('2024-12-03T11:15:00Z'), updatedAt: new Date('2024-12-03T11:45:00Z') },
//   { id: 15, amount: 1800, content: "Rent payment", status: "Completed", srcAccount: "4545454545", srcBankName: "Bank CC", desAccount: "8989898989", desBankName: "Bank DD", createdAt: new Date('2024-12-01T13:00:00Z'), updatedAt: new Date('2024-12-01T14:00:00Z') },
//   { id: 16, amount: 20, content: "Fast food payment", status: "Pending", srcAccount: "1212121212", srcBankName: "Bank EE", desAccount: "3434343434", desBankName: "Bank FF", createdAt: new Date('2024-12-03T08:20:00Z'), updatedAt: new Date('2024-12-03T08:50:00Z') },
//   { id: 17, amount: 3000, content: "Furniture purchase", status: "Completed", srcAccount: "2323232323", srcBankName: "Bank GG", desAccount: "6565656565", desBankName: "Bank HH", createdAt: new Date('2024-11-28T10:30:00Z'), updatedAt: new Date('2024-11-28T11:30:00Z') },
//   { id: 18, amount: 15.99, content: "Streaming service subscription", status: "Completed", srcAccount: "9090909090", srcBankName: "Bank II", desAccount: "7878787878", desBankName: "Bank JJ", createdAt: new Date('2024-12-02T12:00:00Z'), updatedAt: new Date('2024-12-02T12:30:00Z') },
//   { id: 19, amount: 450, content: "Holiday savings deposit", status: "Completed", srcAccount: "3434343434", srcBankName: "Bank KK", desAccount: "9090909090", desBankName: "Bank LL", createdAt: new Date('2024-11-30T16:30:00Z'), updatedAt: new Date('2024-11-30T17:00:00Z') },
// ];

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
    cell: () => (
      <div className="flex items-center gap-x-4">
        Chuyển tiền
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "id",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-1">
        #{row.getValue("id")}
      </div>
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
          <div className="font-semibold">Nguyen Van A</div>
          <div>{row.original.desAccount} <span className="border px-2 rounded ml-3 font-semibold">{row.original.desBankName}</span></div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "amount",
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"));
      return (
        <div className={`${amount >= 0 ? 'text-purple-500': 'text-red-500'}`}>
          {amount >= 0 ? '+': '-'}{amount}
        </div>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "createdAt",
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue("createdAt").toLocaleString()}
        </div>
      )
    }
  },
];
export default function TransactionHistory() {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });
  const [globalFilter, setGlobalFilter] = useState("");  
  const [rowSelection, setRowSelection] = useState({});

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: getAllTransactionsApi,
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
      globalFilter: '', // Set initial state if not managing globalFilter state
      columnVisibility: {
        desAccount: false, 
        desBankName: false, 
      },
    },
  });

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  const currentPage =
  table.getPageCount() > 0
    ? table.getState().pagination.pageIndex + 1
    : 0;

  const totalAmount = Math.floor(transactions.reduce((a: number, b: Transaction) => a + b.amount, 0));

  return (
    <div className="w-full border-2 p-6 rounded-lg">
      <div className="flex flex-row justify-between items-end">
        <div>
          <p className="font-semibold">Lịch sử giao dịch với các ngân hàng khác</p>
          <p className="text-gray-500">{transactions.length} giao dịch</p>
        </div>
        <div>
          <span className="text-gray-500">Tổng số tiền đã giao dịch:</span> 
          <span className="text-purple-500 text-2xl">{totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
        </div>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Lọc..."
          value={globalFilter}
          onChange={(event) =>
            table.setGlobalFilter(String(event.target.value))
          }
          className="w-64 h-9"
        />
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
