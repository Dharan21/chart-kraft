import { CSVData, CSVRow, SupportedDataType } from "@/models/CSVData";
import {
  DateFilterOption,
  NumberFilterOption,
  StringFilterOption,
} from "@/models/FilterOptions";
import { AggregateOption } from "@/models/GroupByOptions";
import {
  FilterData,
  FilterType,
  GroupData,
  SortData,
} from "@/models/Transformation";

function splitCSVLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      cells.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

export function readHeaders(csvString: string): string[] {
  const firstLine = csvString.replace(/^\uFEFF/, "").split(/\r?\n/, 1)[0];
  return splitCSVLine(firstLine);
}

export function parseCSV(csvString: string): CSVData {
  const lines = csvString.replace(/^\uFEFF/, "").split(/\r?\n/);
  const header = splitCSVLine(lines[0] ?? "");
  const data: CSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cells = splitCSVLine(lines[i]);
    const rowData: CSVRow = {};
    for (let j = 0; j < header.length; j++) {
      rowData[header[j]] = cells[j] ?? "";
    }
    data.push(rowData);
  }
  return {
    headers: header.map((h) => ({ name: h, type: SupportedDataType.String })),
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
      if (!!value) {
        value = (value as string).trim();
        if (value.toLowerCase() == "null") {
          value = null;
        }
        if (
          dataType === SupportedDataType.Number &&
          isNaN(parseFloat(value as string))
        ) {
          errorLines.push(index + 1);
        } else if (
          dataType === SupportedDataType.Date &&
          isNaN(Date.parse(value as string))
        ) {
          errorLines.push(index + 1);
        }
      }
      // else if (dataType === "date" && isNaN(Date.parse(value as string))) {
      //   errorLines.push(index + 1);
      // }
    });
  });

  return errorLines;
}

export function describeErrorLines(lines: number[]): string {
  const unique = Array.from(new Set(lines));
  const shown = unique.slice(0, 10).join(", ");
  const extra = unique.length > 10 ? ` and ${unique.length - 10} more` : "";
  return `Some values do not match the selected data types (rows: ${shown}${extra}). Change those columns to String or fix the file.`;
}

export function convertCSVDataToSpecficTypes(
  csvData: CSVData,
  datatypes: { header: string; dataType: SupportedDataType }[]
): CSVData {
  return {
    headers: datatypes.map((x) => ({ name: x.header, type: x.dataType })),
    rows: csvData.rows.map((row) => {
      const newRow: CSVRow = {};
      Object.entries(row).forEach(([header, value]) => {
        const headerType = datatypes.find((x) => x.header === header);
        if (headerType) {
          value = (value as string).trim();
          if (value.toLowerCase() == "null") {
            value = null;
          }
          if (headerType.dataType === SupportedDataType.Number) {
            newRow[header] = !!value ? parseFloat(value as string) : null;
          } else if (headerType.dataType === SupportedDataType.String) {
            newRow[header] = value;
          } else if (headerType.dataType === SupportedDataType.Date) {
            newRow[header] = !!value
              ? new Date(value as string).toISOString()
              : null;
          }
        }
      });
      return newRow;
    }),
  };
}

export function applyFilterTransform(
  inputData: CSVData,
  filterData: FilterData
): CSVData {
  const { column, type, value, operator } = filterData;
  const columnType = inputData.headers.find((x) => x.name === column)?.type;
  const filteredRows = inputData.rows.filter((row, index) => {
    let cellValue = row[column];
    let compareValue: any = value.trim();
    if (type == FilterType.Relative) {
      compareValue = row[compareValue];
    }

    switch (columnType) {
      case SupportedDataType.Number:
        compareValue = parseFloat(compareValue);
        cellValue = cellValue as number;
        switch (operator) {
          case NumberFilterOption.GreaterThan:
            return cellValue > compareValue;
          case NumberFilterOption.GreaterThanOrEqual:
            return cellValue >= compareValue;
          case NumberFilterOption.LesserThan:
            return cellValue < compareValue;
          case NumberFilterOption.LesserThanOrEqual:
            return cellValue <= compareValue;
          case NumberFilterOption.Equal:
            return cellValue === compareValue;
          case NumberFilterOption.NotEqual:
            return cellValue !== compareValue;
          default:
            return false;
        }
        break;
      case SupportedDataType.String:
        cellValue = cellValue as string;
        compareValue = compareValue as string;
        switch (operator) {
          case StringFilterOption.Contains:
            return cellValue.includes(compareValue);
          case StringFilterOption.Equal:
            return cellValue === compareValue;
          case StringFilterOption.EndsWith:
            return cellValue.endsWith(compareValue);
          case StringFilterOption.NotContains:
            return !cellValue.includes(compareValue);
          case StringFilterOption.NotEqual:
            return cellValue !== compareValue;
          case StringFilterOption.StartsWith:
            return cellValue.startsWith(compareValue);
          default:
            return false;
        }
        break;
      case SupportedDataType.Date:
        cellValue = new Date(cellValue as string);
        compareValue = new Date(compareValue);
        switch (operator) {
          case DateFilterOption.Before:
            return cellValue < compareValue;
          case DateFilterOption.After:
            return cellValue > compareValue;
          case DateFilterOption.On:
            return cellValue.toDateString() === compareValue.toDateString();
          case DateFilterOption.NotOn:
            return cellValue.toDateString() !== compareValue.toDateString();
          default:
            return false;
        }
      default:
    }
  });

  return {
    headers: inputData.headers,
    rows: filteredRows,
  };
}

export function applySortTransform(
  inputData: CSVData,
  sortData: SortData[]
): CSVData {
  const sortedRows = [...inputData.rows].sort((a, b) => {
    for (const { column, direction } of sortData) {
      const x = a[column];
      const y = b[column];
      if (x === y) continue;
      // nulls always sort last
      if (x == null) return 1;
      if (y == null) return -1;
      const cmp = x > y ? 1 : x < y ? -1 : 0;
      if (cmp !== 0) return direction === "asc" ? cmp : -cmp;
    }
    return 0;
  });

  return {
    headers: inputData.headers,
    rows: sortedRows,
  };
}

export function applyGroupTransform(
  inputData: CSVData,
  groupData: GroupData
): CSVData {
  const buckets = new Map<string, CSVRow[]>();
  for (const row of inputData.rows) {
    const key = JSON.stringify(groupData.columns.map((c) => row[c]));
    const bucket = buckets.get(key);
    if (bucket) bucket.push(row);
    else buckets.set(key, [row]);
  }

  const groupedRows: CSVRow[] = [];
  buckets.forEach((matches) => {
    const newRow: CSVRow = {};
    groupData.columns.forEach((column) => {
      newRow[column] = matches[0][column];
    });
    groupData.aggregateData.forEach(({ column, aggregateOption }) => {
      const values = matches.map((m) => Number(m[column]) || 0);
      switch (aggregateOption) {
        case AggregateOption.Sum:
          newRow[column] = values.reduce((sum, v) => sum + v, 0);
          break;
        case AggregateOption.Average:
          newRow[column] = values.reduce((sum, v) => sum + v, 0) / values.length;
          break;
        case AggregateOption.Count:
          newRow[column] = matches.length;
          break;
        case AggregateOption.Min:
          newRow[column] = values.reduce((a, v) => Math.min(a, v), values[0]);
          break;
        case AggregateOption.Max:
          newRow[column] = values.reduce((a, v) => Math.max(a, v), values[0]);
          break;
      }
    });
    groupedRows.push(newRow);
  });

  return {
    headers: inputData.headers.filter(
      (header) =>
        groupData.columns.includes(header.name) ||
        groupData.aggregateData.some((x) => x.column === header.name)
    ),
    rows: groupedRows,
  };
}
