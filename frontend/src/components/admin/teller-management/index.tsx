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
import PaginationSection from "../pagination";
import { Button } from "@/components/ui/button";
import {
  getAllTellersApi,
  postTellerApi,
  updateTellerApi,
  deleteTellerApi,
} from "@/api/admin.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import DeleteTellerModal from "./delete-teller-modal";
import EditTellerModal from "./edit-teller-modal";
import AddTellerDialog from "./add-teller-dialog";
import { useToast } from "@/hooks/use-toast";

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

export default function TellerManagement() {
  const {toast} = useToast();
  const [openAddForm, setOpenAddForm] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const { data: tellers, isLoading, refetch: refetchTellers } = useQuery({
    queryKey: ["tellers"],
    queryFn: getAllTellersApi,
  });

  const { mutate: addTellerMutate } = useMutation({
    mutationFn: postTellerApi,
    onSuccess: () => {
      toast({
        title: "Thêm giao dịch viên thành công",
        description: "Bạn đã thêm giao dịch viên thành công",
      });

      setOpenAddForm(false);
      refetchTellers();
    }
  });

  function handleAdd(teller: {
    username: string;
    password: string;
    fullName: string;
    email: string;
    phone: string;
  }) {
    addTellerMutate(teller);
  }
  const { mutate: deleteTellerMutate } = useMutation({
    mutationFn: deleteTellerApi,
    onSuccess: (response) => {
      if (response.deleted) {
        toast({
          title: "Xóa giao dịch viên thành công",
          description: "Bạn đã xóa giao dịch viên thành công",
        });
        refetchTellers();
        return;
      }

      toast({
        title: "Xóa giao dịch viên thất bại",
        description: "Bạn đã xóa giao dịch viên thất bại",
        variant: "destructive",
      });
    }
  });

  const { mutate: editTellerMutate } = useMutation({
    mutationFn: async ({
      tellerId,
      teller,
    }: {
      tellerId: number;
      teller: {
        username?: string;
        password?: string;
        fullName?: string;
        email?: string;
        phone?: string;
      };
    }) => {
      return await updateTellerApi(tellerId, teller);
    },
    onSuccess: (response) => {
      if (response.updated) {
        toast({
          title: "Cập nhật giao dịch viên thành công",
          description: "Bạn đã cập nhật giao dịch viên thành công",
        });
        refetchTellers();
        return;
      }

      toast({
        title: "Cập nhật giao dịch viên thất bại",
        description: "Bạn đã cập nhật giao dịch viên thất bại",
        variant: "destructive",
      });
    }
  });

  function handleEdit(
    tellerId: number,
    teller: {
      username?: string;
      password?: string;
      fullName?: string;
      email?: string;
      phone?: string;
    }
  ) {
    editTellerMutate({ tellerId, teller });
  }

  const columns: ColumnDef<Teller>[] = [
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
      cell: ({ row }) => {
        const teller: Teller = {
          fullName: row.getValue("fullName"),
          email: row.getValue("email"),
          phone: row.getValue("phone"),
          username: row.getValue("username"),
          id: row.original.id,
        };
        return (
          <div className="flex items-center justify-end w-11">
            <EditTellerModal teller={teller} handleEdit={handleEdit}>
              <Edit className="h-4 cursor-pointer" />
            </EditTellerModal>
            <DeleteTellerModal
              handleDelete={() => deleteTellerMutate(teller.id)}
              tellerName={row.getValue("fullName")}
              tellerId={row.original.id}
            >
              <Trash className="h-4 cursor-pointer" />
            </DeleteTellerModal>
          </div>
        );
      },
    },
  ];

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
      globalFilter: "", // Set initial state if not managing globalFilter state
    },
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  const currentPage =
    table.getPageCount() > 0 ? table.getState().pagination.pageIndex + 1 : 0;

  return (
    <div className="w-full border-2 p-6 rounded-lg">
      <div className="flex flex-row justify-between items-center">
        <div>
          <p className="font-semibold">Danh sách giao dịch viên</p>
          <p className="text-gray-500">{tellers.length} giao dịch viên</p>
        </div>
        <AddTellerDialog handleAdd={handleAdd} open={openAddForm} setOpen={setOpenAddForm}>
          <Button>Tạo giao dịch viên</Button>
        </AddTellerDialog>
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
