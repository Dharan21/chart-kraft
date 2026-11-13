import { CSVData, SupportedDataType } from "@/models/CSVData";
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

type TableTabProps = {
  csvData: CSVData;
};

function formatCell(
  value: string | number | Date | null | undefined,
  type: SupportedDataType | undefined
): string {
  if (value === null || value === undefined || value === "") return "";
  switch (type) {
    case SupportedDataType.Date: {
      const d = new Date(value as string);
      // Dates are stored as UTC ISO strings; format in UTC so a date-only
      // value like 2023-01-01 does not shift a day in western timezones.
      return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
    }
    case SupportedDataType.Number: {
      const n = Number(value);
      if (isNaN(n)) return "";
      return Number.isInteger(n) ? n.toString() : n.toFixed(2);
    }
    default:
      return String(value);
  }
}

export default function TableTabComponent({ csvData }: TableTabProps) {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const visibleRows = React.useMemo(
    () =>
      (csvData?.rows ?? []).slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [page, rowsPerPage, csvData]
  );
  const headerTypes = React.useMemo(
    () =>
      (csvData?.headers ?? []).reduce((acc, header) => {
        acc[header.name] = header.type;
        return acc;
      }, {} as Record<string, SupportedDataType>),
    [csvData]
  );

  // Reset to the first page when the data changes (e.g. a new filter).
  React.useEffect(() => setPage(1), [csvData]);

  if (!csvData) {
    return <></>;
  }

  const totalItems = csvData.rows.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (rows: number) => {
    setRowsPerPage(rows);
    setPage(1);
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
            <TableBody>
              {visibleRows.map((row, index) => (
                <TableRow key={(page - 1) * rowsPerPage + index}>
                  {csvData.headers.map(({ name }) => (
                    <TableCell
                      key={name}
                      className={
                        headerTypes[name] === SupportedDataType.Number
                          ? "text-right tabular-nums"
                          : undefined
                      }
                    >
                      {formatCell(row[name], headerTypes[name])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {visibleRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={Math.max(csvData.headers.length, 1)}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No rows match the current transformations.
                  </TableCell>
                </TableRow>
              )}
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
        </CardContent>
      </Card>
    </>
  );
}
