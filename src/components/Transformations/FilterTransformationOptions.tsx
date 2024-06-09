"use client";

import { Header } from "@/models/CSVData";
import {
  numberFilterOptions,
  stringFilterOptions,
} from "@/models/FilterOptions";
import { FilterData } from "@/models/Transformation";
import { ChangeEvent, useEffect, useState } from "react";

type FilterTransformationOptionsProps = {
  filterData: FilterData;
  headers: Header[];
  onFilterDataChange: (data: FilterData) => void;
};

export default function FilterTransformationOptionsComponent({
  filterData,
  headers,
  onFilterDataChange,
}: FilterTransformationOptionsProps) {
  const [filterDataCopy, setFilterDataCopy] = useState<FilterData | null>(null);
  const [selectedColumnDataType, setSelectedColumnDataType] =
    useState<string>("");

  useEffect(() => {
    if (!!filterData) {
      setFilterDataCopy(JSON.parse(JSON.stringify(filterData)));
    }
    setFilterDataCopy((prev) => {
      if (!!prev) return prev;
      return {
        type: "absolute",
      } as FilterData;
    });
  }, [filterData]);

  const hanldleFilterColumnChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterDataCopy((prev) => {
      if (prev) {
        return {
          ...prev,
          column: e.target.value,
        };
      } else {
        return {
          column: e.target.value,
        } as FilterData;
      }
    });

    const selectedColumn = headers.find(
      (header) => header.name === e.target.value
    );
    if (selectedColumn) {
      if (selectedColumn?.type !== selectedColumnDataType) {
        setSelectedColumnDataType(selectedColumn.type);
        setFilterDataCopy(
          (prev) =>
            ({
              column: prev?.column,
              type: "absolute",
            } as FilterData)
        );
      }
    }
  };

  const handleFilterDataChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFilterDataCopy(
      (prev) =>
        ({
          ...prev,
          [e.target.name]: e.target.value,
        } as FilterData)
    );
  };

  const validateInputs = () => {
    if (
      !filterDataCopy?.column ||
      !filterDataCopy?.operator ||
      !filterDataCopy?.type ||
      !filterDataCopy?.value
    ) {
      alert("Please fill all the fields");
      return false;
    }

    if (
      filterDataCopy?.type === "relative" &&
      !headers.find((header) => header.name === filterDataCopy?.value)
    ) {
      alert("Invalid column selected");
      return false;
    }

    const filterColumn = headers.find(
      (header) => header.name == filterDataCopy?.column
    );
    if (filterColumn?.type == "number" && filterDataCopy?.type == "absolute") {
      const value = parseFloat(filterDataCopy?.value);
      if (isNaN(value)) {
        alert("Invalid number entered");
        return false;
      }
    }

    return true;
  };

  const handleApplyClick = () => {
    if (!!filterDataCopy && validateInputs()) {
      onFilterDataChange(filterDataCopy);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div>Select Filter Options</div>
        <select
          value={filterDataCopy?.column ?? ""}
          onChange={hanldleFilterColumnChange}
        >
          <option value="">Select Column</option>
          {headers.map((header) => (
            <option key={header.name} value={header.name}>
              {header.name}
            </option>
          ))}
        </select>
        <select
          value={filterDataCopy?.operator ?? ""}
          name="operator"
          onChange={handleFilterDataChange}
        >
          <option value="">Select Operator</option>
          {selectedColumnDataType === "string" &&
            stringFilterOptions.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          {selectedColumnDataType === "number" &&
            numberFilterOptions.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
        </select>
        <div className="flex items-center gap-2">
          <div>
            <select
              value={filterDataCopy?.type ?? "absolute"}
              name="type"
              onChange={handleFilterDataChange}
            >
              <option value="absolute">Select Value</option>
              <option value="relative">Select Column</option>
            </select>
          </div>
          <div>
            {filterDataCopy?.type === "absolute" && (
              <input
                className="px-2"
                type="text"
                value={filterDataCopy?.value ?? ""}
                placeholder="Enter Value"
                name="value"
                onChange={handleFilterDataChange}
              />
            )}
            {filterDataCopy?.type === "relative" && (
              <select
                value={filterDataCopy?.value ?? ""}
                name="value"
                onChange={handleFilterDataChange}
              >
                <option value="">Select Column</option>
                {headers
                  .filter((header) => header.type == selectedColumnDataType)
                  .map((header) => (
                    <option key={header.name} value={header.name}>
                      {header.name}
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>
        <button
          type="button"
          className="bg-success p-2 font-semibold"
          onClick={handleApplyClick}
        >
          Apply
        </button>
      </div>
    </>
  );
}
