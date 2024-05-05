import React, { use, useEffect, useState } from "react";
import DialogComponent from "@/components/Dialog/Dialog";
import { CSVData, SupportedDataType } from "@/models/CSVData";
import { validateCSVData } from "@/utils/utility-functions";

interface HeadersTypeSelectionProps {
  isOpen: boolean;
  csvData: CSVData;
  onClose: () => void;
  onDataTypeSelect: (
    datatypes: { header: string; dataType: SupportedDataType }[]
  ) => void;
}

export default function HeadersTypeSelectionComponent({
  isOpen,
  csvData,
  onClose,
  onDataTypeSelect,
}: HeadersTypeSelectionProps) {
  const headers = csvData.headers.map((x) => x.name);
  const [headersToShow, setHeadersToShow] = useState<string[]>(headers);
  const [selectedDataTypes, setSelectedDataTypes] = useState<{
    [key: string]: SupportedDataType;
  }>({});
  const [isShowStartCrafting, setIsShowStartCrafting] =
    useState<boolean>(false);

  useEffect(() => {
    setHeadersToShow(headers);
  }, [csvData]);

  const handleDataTypeSelect = (
    header: string,
    dataType: SupportedDataType
  ) => {
    setSelectedDataTypes((prevState) => ({
      ...prevState,
      [header]: dataType,
    }));
  };

  const validate = () => {
    const errorLineNos = validateCSVData(csvData, selectedDataTypes);
    if (errorLineNos.length > 0) {
      alert("errorLineNos: " + errorLineNos.join(", "));
    } else {
      setIsShowStartCrafting(true);
    }
  };

  const handleRemoveColumnClick = (header: string) => {
    setHeadersToShow((prevState) => prevState.filter((x) => x !== header));
  };

  const handleConfirm = () => {
    setIsShowStartCrafting(false);
    onClose();
    const selectedDataTypesArray = headersToShow.map((header) => ({
      header,
      dataType: selectedDataTypes[header] || "string",
    }));
    onDataTypeSelect(selectedDataTypesArray);
  };

  return (
    <DialogComponent isOpen={isOpen} onClose={onClose}>
      <h2>Select Data Types</h2>
      <form>
        <div className="max-h-[40vh] overflow-y-auto mb-2">
          {headersToShow.map((header, index) => (
            <div key={header} className="flex justify-between mb-2">
              <label htmlFor={header}>{header}</label>
              <div className="flex gap-1">
                <select
                  id={header}
                  value={selectedDataTypes[header] || "string"}
                  onChange={(e) =>
                    handleDataTypeSelect(
                      header,
                      e.target.value as SupportedDataType
                    )
                  }
                >
                  <option value="">Select Data Type</option>
                  <option value="string">String</option>
                  <option value="number">Number</option>
                </select>
                <div
                  className="bg-red-500 p-1 rounderd-xl text-white cursor-pointer"
                  onClick={() => handleRemoveColumnClick(header)}
                >
                  Remove
                </div>
              </div>
            </div>
          ))}
        </div>
        {isShowStartCrafting ? (
          <button
            type="button"
            className="bg-green-500 px-2 py-1 rounded-2xl"
            onClick={handleConfirm}
          >
            Start Crafting
          </button>
        ) : (
          <button
            type="button"
            className="bg-blue-500 px-2 py-1 rounded-2xl"
            onClick={validate}
          >
            Validate
          </button>
        )}
      </form>
    </DialogComponent>
  );
}
