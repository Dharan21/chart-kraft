import { CSVData, SupportedDataType } from "@/models/CSVData";
import { FilterOptions, FilterRow } from "@/models/FilterOptions";
import { useState } from "react";

type DataFilterProps = {
  csvData: CSVData;
  onFilterData: (filteredData: CSVData) => void;
};

export default function DataFilterComponent({
  csvData,
  onFilterData,
}: DataFilterProps) {
  const [filterRows, setFilterRows] = useState<FilterRow[]>([]);

  const handleAddFilter = () => {
    setFilterRows([
      ...filterRows,
      { header: "", dataType: "", type: "", value: "" },
    ]);
  };

  const handleHeaderDropdownChange = (index: number, header: string) => {
    const newFilterRows = [...filterRows];
    const type = csvData.headers.find((x) => x.name === header)?.type;
    switch (type) {
      case "number":
        newFilterRows[index] = {
          header,
          dataType: "number",
          type: "",
          value: "",
        };
        break;
      case "string":
        newFilterRows[index] = {
          header,
          dataType: "string",
          type: "",
          value: "",
        };
        break;
    }
    setFilterRows(newFilterRows);
  };

  const handleFilterTypeChange = (
    index: number,
    value: FilterOptions
  ): void => {
    const newFilterRows = [...filterRows];
    newFilterRows[index].type = value;
    setFilterRows(newFilterRows);
  };

  const handleInputChange = (index: number, value: string) => {
    const newFilterRows = [...filterRows];
    newFilterRows[index].value = value;
    setFilterRows(newFilterRows);
  };

  const handleApplyFilter = () => {
    const isValid = validateFilterRows();
    if (!isValid) {
      alert("Invalid filter data");
      return;
    }
    let filteredData = csvData.rows;
    filterRows.forEach((row) => {
      switch (row.dataType) {
        case "number":
          switch (row.type) {
            case "greater":
              filteredData = filteredData.filter(
                (data) => Number(data[row.header]) > Number(row.value)
              );
              break;
            case "lesser":
              filteredData = filteredData.filter(
                (data) => Number(data[row.header]) < Number(row.value)
              );
              break;
            case "equal":
              filteredData = filteredData.filter(
                (data) => data[row.header] === row.value
              );
              break;
            case "notEqual":
              filteredData = filteredData.filter(
                (data) => data[row.header] !== row.value
              );
              break;
          }
          break;
        case "string":
          switch (row.type) {
            case "equal":
              filteredData = filteredData.filter(
                (data) => data[row.header] === row.value
              );
              break;
            case "notEqual":
              filteredData = filteredData.filter(
                (data) => data[row.header] !== row.value
              );
              break;
            case "contains":
              filteredData = filteredData.filter((data) =>
                (data[row.header] as string).includes(row.value)
              );
              break;
            case "notContains":
              filteredData = filteredData.filter(
                (data) => !(data[row.header] as string).includes(row.value)
              );
              break;
            case "startsWith":
              filteredData = filteredData.filter((data) =>
                (data[row.header] as string).startsWith(row.value)
              );
              break;
            case "endsWith":
              filteredData = filteredData.filter((data) =>
                (data[row.header] as string).endsWith(row.value)
              );
              break;
          }
          break;
      }
    });
    onFilterData({ headers: csvData.headers, rows: filteredData });
  };

  const validateFilterRows = (): boolean => {
    return filterRows.every((row) => {
      const isHeaderSelected = row.header !== "" && row.type !== "";
      const isValuePresent = row.value !== "";
      switch (row.dataType) {
        case "number":
          return (
            isHeaderSelected && isValuePresent && !isNaN(Number(row.value))
          );
        case "string":
          return isHeaderSelected && isValuePresent;
      }
    });
  };

  const handleFilterRemove = (index: number): void => {
    const newFilterRows = [...filterRows];
    newFilterRows.splice(index, 1);
    setFilterRows(newFilterRows);
  };

  const handleResetFilters = () => {
    setFilterRows([]);
    onFilterData(csvData);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="p-2">Filter Data</div>
        <button
          className="p-2 bg-blue-500"
          type="button"
          onClick={handleAddFilter}
        >
          Add Filter
        </button>
        {filterRows.map((row, index) => (
          <div key={index} className="p-2 flex flex-row">
            <select
              className="w-1/4"
              name={`filter-data-${index}`}
              value={row.header}
              onChange={(e) =>
                handleHeaderDropdownChange(index, e.target.value)
              }
            >
              <option value="">Select</option>
              {csvData.headers.map((header) => (
                <option key={header.name} value={header.name}>
                  {header.name}
                </option>
              ))}
            </select>
            <select
              className="w-1/4"
              name={`filter-type-${index}`}
              value={row.type}
              onChange={(e) =>
                handleFilterTypeChange(index, e.target.value as FilterOptions)
              }
            >
              <option value="">Select</option>
              {row.dataType === "number" && (
                <>
                  <option value="greater">Greater</option>
                  <option value="lesser">Lesser</option>
                  <option value="equal">Equal</option>
                  <option value="notEqual">Not Equal</option>
                </>
              )}
              {row.dataType === "string" && (
                <>
                  <option value="equal">Equal</option>
                  <option value="notEqual">Not Equal</option>
                  <option value="contains">Contains</option>
                  <option value="notContains">Not Contains</option>
                  <option value="startsWith">Starts With</option>
                  <option value="endsWith">Ends With</option>
                </>
              )}
            </select>
            <input
              className="w-1/4"
              type="text"
              value={row.value}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
            <button
              className="w-1/4 bg-red-500"
              type="button"
              onClick={() => handleFilterRemove(index)}
            >
              x
            </button>
          </div>
        ))}
        {filterRows.length > 0 && (
          <button
            className="p-2 bg-green-500"
            type="button"
            onClick={handleApplyFilter}
          >
            Apply Filter
          </button>
        )}
        <button
          className="p-2 bg-yellow-500"
          type="button"
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      </div>
    </>
  );
}
