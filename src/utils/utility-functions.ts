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
