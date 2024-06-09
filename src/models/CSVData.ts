export type CSVRow = { [key: string]: string | number | Date | null };
export type CSVData = { headers: Header[]; rows: CSVRow[] };

export type Header = { name: string; type: SupportedDataType };

export enum SupportedDataType {
  String = "String",
  Number = "Number",
  Date = "Date",
}
