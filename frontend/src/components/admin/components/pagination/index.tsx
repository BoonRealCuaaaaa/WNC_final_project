import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationSectionProps {
  canPreviousPage: boolean;
  canNextPage: boolean;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handleFirstPage: () => void;
  handleLastPage: () => void;
  currentPage: number;
  totalPage: number;
}

export default function PaginationSection({
  canPreviousPage,
  canNextPage,
  handlePreviousPage,
  handleNextPage,
  handleFirstPage,
  handleLastPage,
  currentPage,
  totalPage,
}: PaginationSectionProps) {
  return (
    <Pagination className="justify-end">
      <PaginationContent className="gap-x-2">
        <PaginationItem>
          <Button variant="outline" disabled={!canPreviousPage}  onClick={handleFirstPage}>
            <ChevronsLeft />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button variant="outline" disabled={!canPreviousPage} onClick={handlePreviousPage}>
            <ChevronLeft />
          </Button>
        </PaginationItem>
        <PaginationItem className="mx-3">
          <div className="flex w-fit">
            Page {currentPage} of {totalPage}
          </div>
        </PaginationItem>

        <PaginationItem>
          <Button variant="outline" disabled={!canNextPage}  onClick={handleNextPage}>
            <ChevronRight />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button variant="outline" disabled={!canNextPage}  onClick={handleLastPage}>
            <ChevronsRight />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
