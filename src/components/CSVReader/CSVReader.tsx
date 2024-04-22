import {
  convertCSVDataToSpecficTypes,
  parseCSV,
  readHeaders,
} from "@/utils/utility-functions";
import React, { useState, ChangeEvent } from "react";
import HeadersTypeSelectionComponent from "../HeadersTypeSelection/HeadersTypeSelection";
import { CSVData, CSVRow, SupportedDataType } from "@/models/CSVData";

type CSVReaderProps = {
  onCSVData: (data: CSVData) => void;
};

const CSVReader: React.FC<CSVReaderProps> = ({ onCSVData }) => {
  const [error, setError] = useState<string>("");
  const [isOpenTypeSettingDialog, setIsOpenTypeSettingDialog] =
    useState<boolean>(false);

  const [headers, setHeaders] = useState<string[]>([]);
  const [csvData, setCSVData] = useState<CSVData>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileNameParts = file.name.split(".");
    const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();

    if (fileExtension === "csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target?.result as string;
        console.log(contents);
        const headers = readHeaders(contents);
        setHeaders(headers);
        setIsOpenTypeSettingDialog(true);
        const csv = parseCSV(contents);
        setCSVData(csv);
      };
      reader.readAsText(file);
      setError("");
    } else {
      setError("Please select a CSV file.");
    }
  };

  const handleDataTypeSelect = (
    datatypes: { header: string; dataType: SupportedDataType }[]
  ) => {
    const data = convertCSVDataToSpecficTypes(csvData, datatypes);
    onCSVData(data);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <HeadersTypeSelectionComponent
        isOpen={isOpenTypeSettingDialog}
        headers={headers}
        csvData={csvData}
        onClose={() => setIsOpenTypeSettingDialog(false)}
        onDataTypeSelect={handleDataTypeSelect}
      />
    </div>
  );
};

export default CSVReader;