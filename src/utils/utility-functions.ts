import { CSVData, CSVRow, SupportedDataType } from "@/models/CSVData";
import { AggregateOption } from "@/models/GroupByOptions";
import { FilterData, GroupData, SortData } from "@/models/Transformation";

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
      if (!!value) {
        value = (value as string).trim();
        if (value.toLowerCase() == "null") {
          value = null;
        }
        if (dataType === "number" && isNaN(parseFloat(value as string))) {
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
          if (headerType.dataType === "number") {
            newRow[header] = !!value ? parseFloat(value as string) : null;
          } else if (headerType.dataType === "string") {
            newRow[header] = value;
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
    if (type == "relative") {
      compareValue = row[compareValue];
    }

    switch (columnType) {
      case "number":
        compareValue = parseFloat(compareValue);
        cellValue = cellValue as number;
        switch (operator) {
          case "greater":
            return cellValue > compareValue;
          case "lesser":
            return cellValue < compareValue;
          case "equal":
            return cellValue === compareValue;
          default:
            return false;
        }
        break;
      case "string":
        cellValue = cellValue as string;
        compareValue = compareValue as string;
        switch (operator) {
          case "contains":
            return cellValue.includes(compareValue);
          case "equal":
            return cellValue === compareValue;
          case "endsWith":
            return cellValue.endsWith(compareValue);
          case "notContains":
            return !cellValue.includes(compareValue);
          case "notEqual":
            return cellValue !== compareValue;
          case "startsWith":
            return cellValue.startsWith(compareValue);
          default:
            return false;
        }
        break;
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
  const sortedRows = inputData.rows.sort((a, b) => {
    for (let i = 0; i < sortData.length; i++) {
      const { column, direction } = sortData[i];
      // @ts-ignore
      if (a[column] > b[column]) {
        return direction === "asc" ? 1 : -1;
        // @ts-ignore
      } else if (a[column] < b[column]) {
        return direction === "asc" ? -1 : 1;
      }
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
  const groupedRows = inputData.rows.reduce((arr, row) => {
    const match = arr.find((obj) =>
      groupData.columns.every((column) => obj[column] === row[column])
    );
    if (match) {
      return arr;
    } else {
      const allMatches = inputData.rows.filter((obj) =>
        groupData.columns.every((column) => obj[column] === row[column])
      );
      const newRow: CSVRow = {};
      groupData.columns.forEach((column) => {
        newRow[column] = row[column];
      });
      groupData.aggregateData.forEach((aggregate) => {
        switch (aggregate.aggregateOption) {
          case AggregateOption.Sum:
            newRow[aggregate.column] = allMatches.reduce(
              (sum, obj) => sum + (obj[aggregate.column] as number),
              0
            );
            break;
          case AggregateOption.Average:
            newRow[aggregate.column] =
              allMatches.reduce(
                (sum, obj) => sum + (obj[aggregate.column] as number),
                0
              ) / allMatches.length;
            break;
          case AggregateOption.Count:
            newRow[aggregate.column] = allMatches.length;
            break;
          case AggregateOption.Min:
            newRow[aggregate.column] = allMatches.reduce(
              (min, obj) => Math.min(min, obj[aggregate.column] as number),
              allMatches[0][aggregate.column] as number
            );
            break;
          case AggregateOption.Max:
            newRow[aggregate.column] = allMatches.reduce(
              (max, obj) => Math.max(max, obj[aggregate.column] as number),
              allMatches[0][aggregate.column] as number
            );
            break;
        }
      });
      arr.push(newRow);
    }
    return arr;
  }, [] as CSVRow[]);

  return {
    headers: inputData.headers.filter(
      (header) =>
        groupData.columns.includes(header.name) ||
        groupData.aggregateData.map((x) => x.column).includes(header.name)
    ),
    rows: Object.values(groupedRows),
  };
}
