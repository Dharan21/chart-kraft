import React, { useState } from "react";
import DialogComponent from "@/components/Dialog/Dialog";
import { CSVData, SupportedDataType } from "@/models/CSVData";
import { validateCSVData } from "@/utils/utility-functions";

interface HeadersTypeSelectionProps {
  headers: string[];
  isOpen: boolean;
  csvData: CSVData;
  onClose: () => void;
  onDataTypeSelect: (
    datatypes: { header: string; dataType: SupportedDataType }[]
  ) => void;
}

const HeadersTypeSelectionComponent: React.FC<HeadersTypeSelectionProps> = ({
  headers,
  isOpen,
  csvData,
  onClose,
  onDataTypeSelect,
}) => {
  const [selectedDataTypes, setSelectedDataTypes] = useState<{
    [key: string]: SupportedDataType;
  }>({});
  const [isShowStartCrafting, setIsShowStartCrafting] =
    useState<boolean>(false);

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
    console.log(errorLineNos);
    if (errorLineNos.length > 0) {
      alert("errorLineNos: " + errorLineNos.join(", "));
    } else {
      setIsShowStartCrafting(true);
    }
  };

  const handleConfirm = () => {
    onClose();
    const selectedDataTypesArray = Object.entries(selectedDataTypes).map(
      ([header, dataType]) => ({
        header,
        dataType,
      })
    );
    onDataTypeSelect(selectedDataTypesArray);
  };

  return (
    <DialogComponent isOpen={isOpen} onClose={onClose}>
      <h2>Select Data Types</h2>
      <form>
        <div className="max-h-[40vh] overflow-y-auto">
          {headers.map((header) => (
            <div key={header}>
              <label htmlFor={header}>{header}</label>
              <select
                id={header}
                value={selectedDataTypes[header] || ""}
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
            </div>
          ))}
        </div>
        {isShowStartCrafting ? (
          <button type="button" onClick={handleConfirm}>
            Start Crafting
          </button>
        ) : (
          <button type="button" onClick={validate}>
            Validate
          </button>
        )}
      </form>
    </DialogComponent>
  );
};

export default HeadersTypeSelectionComponent;
