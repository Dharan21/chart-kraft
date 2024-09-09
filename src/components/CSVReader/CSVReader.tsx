import {
  convertCSVDataToSpecficTypes,
  parseCSV,
} from "@/utils/utility-functions";
import React, { useState, ChangeEvent, useRef } from "react";
import HeadersTypeSelectionComponent from "../HeadersTypeSelection/HeadersTypeSelection";
import { CSVData, SupportedDataType } from "@/models/CSVData";

type CSVReaderProps = {
  onLoad: (data: CSVData) => void;
};

export default function CSVReader({ onLoad }: CSVReaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string>("");
  const [isOpenTypeSettingDialog, setIsOpenTypeSettingDialog] =
    useState<boolean>(false);

  const [csvData, setCSVData] = useState<CSVData>({ headers: [], rows: [] });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileNameParts = file.name.split(".");
    const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();

    if (fileExtension === "csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target?.result as string;
        const csv = parseCSV(contents);
        setIsOpenTypeSettingDialog(true);
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
    onLoad(data);
  };

  const handleHeaderTypeSelectOnClose = () => {
    fileRef.current?.value && (fileRef.current.value = "");
    setIsOpenTypeSettingDialog(false);
  };

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <HeadersTypeSelectionComponent
        isOpen={isOpenTypeSettingDialog}
        csvData={csvData}
        onClose={handleHeaderTypeSelectOnClose}
        onDataTypeSelect={handleDataTypeSelect}
      />
    </div>
  );
}
