export type CSVRow = { [key: string]: string | number | null };
export type CSVData = { headers: Header[]; rows: CSVRow[] };

export type Header = { name: string; type: SupportedDataType };

export type SupportedDataType = "string" | "number";
