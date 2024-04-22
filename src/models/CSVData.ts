export type CSVRow = { [key: string]: string | number };
export type CSVData = { headers: Header[]; rows: CSVRow[] };

export type Header = { name: string; type: SupportedDataType };

export type SupportedDataType = "string" | "number";
