import {
  addFilter,
  applyFilters,
  removeFilter,
  resetFilters,
  setFilterHeader,
  setFilterType,
  setFilterValue,
} from "@/lib/features/filters/filtersSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { FilterOptions } from "@/models/FilterOptions";

export default function DataFilterComponent() {
  const csvData = useAppSelector((state) => state.filters.data);
  const filters = useAppSelector((state) => state.filters.filters);
  const dispatch = useAppDispatch();

  if (!csvData) return <></>;

  const handleAddFilter = () => {
    dispatch(addFilter());
  };

  const handleHeaderDropdownChange = (index: number, header: string) => {
    const type = csvData.headers.find((x) => x.name === header)?.type;
    dispatch(setFilterHeader({ index, header, type: type ?? "string" }));
  };

  const handleFilterTypeChange = (
    index: number,
    value: FilterOptions
  ): void => {
    dispatch(setFilterType({ index, value }));
  };

  const handleInputChange = (index: number, value: string) => {
    dispatch(setFilterValue({ index, value }));
  };

  const handleApplyFilter = () => {
    const isValid = validateFilterRows();
    if (!isValid) {
      alert("Invalid filter data");
      return;
    }

    dispatch(applyFilters());
  };

  const validateFilterRows = (): boolean => {
    return filters.every((row) => {
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
    dispatch(removeFilter(index));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
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
        {filters.map((row, index) => (
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
        {filters.length > 0 && (
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
