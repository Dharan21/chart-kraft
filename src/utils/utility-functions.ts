import { CSVData, CSVRow, SupportedDataType } from "@/models/CSVData";

export function readHeaders(csvString: string): string[] {
  return csvString
    .split("\n")[0]
    .split(",")
    .map((cell) => cell.trim());
}

export function parseCSV(csvString: string): CSVData {
  const rows = csvString.split("\n");
  const header = readHeaders(csvString);
  const data = rows
    .slice(1)
    .filter((x) => !!x)
    .map((row) => {
      const cells = row.split(",");
      const rowData: CSVRow = {};
      header.forEach((key, index) => {
        rowData[key] = cells[index].trim();
      });
      return rowData;
    });
  return {
    headers: header.map((h) => ({ name: h, type: "string" })),
    rows: data,
  };
}

export function validateCSVData(
  csvData: CSVData,
  headerTypes: { [key: string]: SupportedDataType }
): number[] {
  const errorLines: number[] = [];

  csvData.rows.forEach((row, index) => {
    Object.entries(row).forEach(([header, value]) => {
      const dataType = headerTypes[header];
      if (dataType === "number" && isNaN(parseFloat(value as string))) {
        errorLines.push(index + 1);
      }
      // else if (dataType === "date" && isNaN(Date.parse(value as string))) {
      //   errorLines.push(index + 1);
      // }
    });
  });

  return errorLines;
}

export function convertCSVDataToSpecficTypes(
  csvData: CSVData,
  datatypes: { header: string; dataType: SupportedDataType }[]
): CSVData {
  return {
    headers: csvData.headers.map((header) => {
      const headerType = datatypes.find((x) => x.header === header.name);
      return { name: header.name, type: headerType?.dataType || "string" };
    }),
    rows: csvData.rows.map((row) => {
      const newRow: CSVRow = {};
      Object.entries(row).forEach(([header, value]) => {
        const headerType = datatypes.find((x) => x.header === header);
        if (headerType?.dataType === "number") {
          newRow[header] = parseFloat(value as string);
        } else {
          newRow[header] = value;
        }
      });
      return newRow;
    }),
  };
}
