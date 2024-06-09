import { CSVData, SupportedDataType } from "@/models/CSVData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import React from "react";

type TableTabProps = {
  csvData: CSVData;
};

export default function TableTabComponent({ csvData }: TableTabProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const visibleRows = React.useMemo(
    () =>
      (csvData?.rows ?? []).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [page, rowsPerPage, csvData]
  );
  const headerTypes = csvData.headers.reduce((acc, header) => {
    acc[header.name] = header.type;
    return acc;
  }, {} as any);

  if (!csvData) {
    return <></>;
  }

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="p-10">
      <Table
        sx={{ background: "white" }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            {csvData.headers.map((header) => (
              <TableCell key={header.name}>{header.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {Object.entries(row).map(([key, value]) => (
                <TableCell key={key}>
                  {headerTypes[key] === SupportedDataType.Date &&
                    format(value as string, "yyyy-MM-dd")}
                  {headerTypes[key] === SupportedDataType.String &&
                    (value as string)}
                  {headerTypes[key] === SupportedDataType.Number &&
                    !!value &&
                    (value as number).toFixed(2)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={csvData.rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
