"use client";

import { Header, SupportedDataType } from "@/models/CSVData";
import {
  DateFilterOption,
  NumberFilterOption,
  StringFilterOption,
} from "@/models/FilterOptions";
import { FilterData, FilterType } from "@/models/Transformation";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
      setSelectedColumnDataType(
        headers.find((header) => header.name === filterData.column)?.type ?? ""
      );
    }
    setFilterDataCopy((prev) => {
      if (!!prev) return prev;
      return {
        type: FilterType.Absolute,
      } as FilterData;
    });
  }, [filterData]);

  const hanldleFilterColumnChange = (value: string) => {
    setFilterDataCopy((prev) => {
      if (prev) {
        return {
          ...prev,
          column: value,
        };
      } else {
        return {
          column: value,
        } as FilterData;
      }
    });

    const selectedColumn = headers.find((header) => header.name === value);
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

  const handleFilterDataChange = (key: string, value: string) => {
    setFilterDataCopy(
      (prev) =>
        ({
          ...prev,
          [key]: value,
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
      filterDataCopy?.type === FilterType.Relative &&
      !headers.find((header) => header.name === filterDataCopy?.value)
    ) {
      alert("Invalid column selected");
      return false;
    }

    const filterColumn = headers.find(
      (header) => header.name == filterDataCopy?.column
    );
    if (
      filterColumn?.type == SupportedDataType.Number &&
      filterDataCopy?.type == FilterType.Absolute
    ) {
      const value = parseFloat(filterDataCopy?.value);
      if (isNaN(value)) {
        alert("Invalid number entered");
        return false;
      }
    }

    if (
      filterColumn?.type == SupportedDataType.Date &&
      filterDataCopy.type == FilterType.Absolute
    ) {
      const date = new Date(filterDataCopy?.value);
      if (isNaN(date.getTime())) {
        alert("Invalid date entered");
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
      <div className="font-semibold">Filter Options</div>
      <div className="flex flex-col gap-2">
        <Select
          value={filterDataCopy?.column ?? ""}
          onValueChange={hanldleFilterColumnChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Column" />
          </SelectTrigger>
          <SelectContent>
            {headers.map((header) => (
              <SelectItem key={header.name} value={header.name}>
                {header.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterDataCopy?.operator ?? ""}
          onValueChange={(value) => handleFilterDataChange("operator", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Operator" />
          </SelectTrigger>
          <SelectContent>
            {selectedColumnDataType === SupportedDataType.String &&
              Object.values(StringFilterOption).map((option, i) => (
                <SelectItem key={i} value={option}>
                  {option}
                </SelectItem>
              ))}
            {selectedColumnDataType === SupportedDataType.Number &&
              Object.values(NumberFilterOption).map((option, i) => (
                <SelectItem key={i} value={option}>
                  {option}
                </SelectItem>
              ))}
            {selectedColumnDataType === SupportedDataType.Date &&
              Object.values(DateFilterOption).map((option, i) => (
                <SelectItem key={i} value={option}>
                  {option}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <div>
            <Select
              value={filterDataCopy?.type ?? FilterType.Absolute}
              onValueChange={(value) => handleFilterDataChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FilterType).map((option, i) => (
                  <SelectItem value={option} key={i}>
                    {option == FilterType.Absolute
                      ? "Select Value"
                      : "Select Column"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            {filterDataCopy?.type === FilterType.Absolute && (
              <Input
                value={filterDataCopy?.value ?? ""}
                placeholder="Enter Value"
                onChange={(e) =>
                  handleFilterDataChange("value", e.target.value)
                }
                name="value"
                type={`${
                  selectedColumnDataType == SupportedDataType.Date
                    ? "date"
                    : "text"
                }`}
              />
            )}
            {filterDataCopy?.type === FilterType.Relative && (
              <Select
                value={filterDataCopy?.value ?? ""}
                onValueChange={(value) =>
                  handleFilterDataChange("value", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Column" />
                </SelectTrigger>
                <SelectContent>
                  {headers
                    .filter((header) => header.type == selectedColumnDataType)
                    .map((header) => (
                      <SelectItem key={header.name} value={header.name}>
                        {header.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <Button type="button" onClick={handleApplyClick}>
          Apply
        </Button>
      </div>
    </>
  );
}
