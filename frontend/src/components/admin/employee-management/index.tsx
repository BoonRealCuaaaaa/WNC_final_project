import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Teller } from "@/types/teller";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import avatarImage from "@/assets/avatar.jpg";
import { Person, Telephone } from "react-bootstrap-icons";
import { Mail, Edit, Trash } from "lucide-react";

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
import PaginationSection from "../components/pagination";
import { Button } from "@/components/ui/button";
import { getTellersApi } from "@/api/teller.api";
import { useQuery } from "@tanstack/react-query";

// const data: Teller[] = [
//   {
//     id: 1,
//     fullName: "Nguyen Van A",
//     phone: "2131231231",
//     username: "nva",
//     email: "a@gmail.com",
//   },
//   {
//     id: 2,
//     fullName: "Nguyen Van A",
//     phone: "2131231231",
//     username: "nva",
//     email: "b@gmail.com",
//   },
//   {
//     id: 3,
//     fullName: "Nguyen Van C",
//     phone: "2131231231",
//     username: "nva",
//     email: "c@gmail.com",
//   },
//   {
//     id: 4,
//     fullName: "Nguyen Van D",
//     phone: "2131231231",
//     username: "nve",
//     email: "d@gmail.com",
//   },
//   {
//     id: 5,
//     fullName: "Nguyen Van B",
//     phone: "2131231231",
//     username: "nva",
//     email: "nva@gmail.com",
//   },
//   {
//     id: 6,
//     fullName: "Nguyen Van A",
//     phone: "2131231231",
//     username: "nva",
//     email: "nva@gmail.com",
//   },
//   {
//     id: 7,
//     fullName: "Nguyen Van A",
//     phone: "2131231231",
//     username: "nva",
//     email: "a@gmail.com",
//   },
//   {
//     id: 8,
//     fullName: "Nguyen Van A",
//     phone: "2131231231",
//     username: "nva",
//     email: "b@gmail.com",
//   },
//   {
//     id: 9,
//     fullName: "Nguyen Van B",
//     phone: "2131231231",
//     username: "nva",
//     email: "c@gmail.com",
//   },
//   {
//     id: 10,
//     fullName: "Nguyen Van A",
//     phone: "2131231231",
//     username: "nva",
//     email: "d@gmail.com",
//   },
//   {
//     id: 11,
//     fullName: "Nguyen Van A",
//     phone: "2131231231",
//     username: "nva",
//     email: "nva@gmail.com",
//   },
//   {
//     id: 12,
//     fullName: "Nguyen Van A",
//     phone: "2131231231",
//     username: "nva",
//     email: "nva@gmail.com",
//   },
// ];

export const columns: ColumnDef<Teller>[] = [
  {
    accessorKey: "fullName",
    header: "fullName",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-4">
        <Avatar>
          <AvatarImage src={avatarImage} />
        </Avatar>
        <div className="capitalize">{row.getValue("fullName")}</div>
      </div>
    ),
  },
  {
    accessorKey: "username",
    header: "username",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-1">
        <Person className="text-lg" />
        {row.getValue("username")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-1 basis-1/4">
        <Telephone className="text-sm" />
        {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "email",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Mail className="h-4" />
        {row.getValue("email")}
      </div>
    ),
  },
  {
    id: "Actions",
    header: "actions",
    cell: () => (
      <div className="flex items-center justify-end w-11">
        <Edit className="h-4" />
        <Trash className="h-4" />
      </div>
    ),
  },
];
export default function TellerManagement() {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });
  const [globalFilter, setGlobalFilter] = useState("");  
  const [rowSelection, setRowSelection] = useState({});

  const { data: tellers, isLoading } = useQuery({
    queryKey: ["tellers"],
    queryFn: getTellersApi,
  });

  const table = useReactTable({
    data: tellers || [],
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
    },
  });

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  const currentPage = table.getState().pagination.pageIndex > 0 ? table.getState().pagination.pageIndex + 1 : 0

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center">
        <div>
          <p className="font-semibold">Danh sách giao dịch viên</p>
          <p className="text-gray-500">{tellers.length} giao dịch viên</p>
        </div>
        <Button>Tạo giao dịch viên</Button>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
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
