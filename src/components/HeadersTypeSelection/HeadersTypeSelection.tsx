import React, { useEffect, useState } from "react";
import DialogComponent from "@/components/Dialog/Dialog";
import { CSVData, SupportedDataType } from "@/models/CSVData";
import { validateCSVData } from "@/utils/utility-functions";
import { MdDelete } from "react-icons/md";

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
      dataType: selectedDataTypes[header] || SupportedDataType.String,
    }));
    onDataTypeSelect(selectedDataTypesArray);
  };

  return (
    <DialogComponent isOpen={isOpen} onClose={onClose}>
      <div className="text-xl">Select Data Types</div>
      <form>
        <div className="max-h-[40vh] overflow-y-auto mb-2">
          {headersToShow.map((header, index) => (
            <div key={header} className="flex justify-between mb-2 mr-2">
              <label htmlFor={header}>{header}</label>
              <div className="flex gap-3">
                <select
                  id={header}
                  value={selectedDataTypes[header] || SupportedDataType.String}
                  onChange={(e) =>
                    handleDataTypeSelect(
                      header,
                      e.target.value as SupportedDataType
                    )
                  }
                >
                  <option value="">Select Data Type</option>
                  {Object.values(SupportedDataType).map((dataType, index) => (
                    <option key={index} value={dataType}>
                      {dataType}
                    </option>
                  ))}
                </select>
                <MdDelete
                  className="cursor-pointer h-full text-danger"
                  onClick={() => handleRemoveColumnClick(header)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex">
          {isShowStartCrafting ? (
            <button
              type="button"
              className="bg-success p-2 font-semibold w-full"
              onClick={handleConfirm}
            >
              Start Crafting
            </button>
          ) : (
            <button
              type="button"
              className="bg-primary p-2 font-semibold w-full"
              onClick={validate}
            >
              Validate
            </button>
          )}
        </div>
      </form>
    </DialogComponent>
  );
}
