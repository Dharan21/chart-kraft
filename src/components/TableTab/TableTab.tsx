import { CSVData, SupportedDataType } from "@/models/CSVData";
import { format } from "date-fns";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Pagination } from "./TablePagination";
import { Card, CardContent } from "../ui/card";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "../ui/pagination";

type TableTabProps = {
  csvData: CSVData;
};

export default function TableTabComponent({ csvData }: TableTabProps) {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const visibleRows = React.useMemo(
    () =>
      (csvData?.rows ?? []).slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [page, rowsPerPage, csvData]
  );
  const totalItems = csvData?.rows.length ?? 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const headerTypes = csvData.headers.reduce((acc, header) => {
    acc[header.name] = header.type;
    return acc;
  }, {} as any);

  if (!csvData) {
    return <></>;
  }

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (rows: number) => {
    setRowsPerPage(rows);
    setPage(1);
  };

  const numberPipe = (value: number): string => {
    if (isNaN(value)) return "";
    if (value % 1 === 0) {
      return value.toString();
    } else {
      return value.toFixed(2);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="font-bold text-2xl">Transformed Data</div>
          <Table>
            <TableHeader>
              <TableRow>
                {csvData.headers.map((header) => (
                  <TableHead key={header.name} className="font-semibold">
                    {header.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="max-h-[300px] overflow-y-scroll">
              {visibleRows.map((row, index) => (
                <TableRow key={index}>
                  {Object.entries(row).map(([key, value]) => (
                    <TableCell key={key}>
                      {headerTypes[key] === SupportedDataType.Date &&
                        format(value as string, "yyyy-MM-dd")}
                      {headerTypes[key] === SupportedDataType.String &&
                        (value as string)}
                      {headerTypes[key] === SupportedDataType.Number &&
                        !!value &&
                        numberPipe(value as number)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPage={rowsPerPage}
            totalItems={totalItems}
          />
          {/* <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              {page > 1 && (
                <PaginationItem>
                  <PaginationLink href="#">{page - 1}</PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink href="#">{page}</PaginationLink>
              </PaginationItem>
              {page < totalPages && (
                <PaginationItem>
                  <PaginationLink href="#">{page + 1}</PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination> */}
        </CardContent>
      </Card>
    </>
  );
}
