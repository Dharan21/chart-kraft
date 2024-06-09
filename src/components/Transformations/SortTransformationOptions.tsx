import { Header } from "@/models/CSVData";
import { SortData, SortDirection } from "@/models/Transformation";
import { ChangeEvent, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

type SortTransformationOptionsComponentProps = {
  sortData: SortData[];
  headers: Header[];
  onSortDataChange: (data: SortData[]) => void;
};

export default function SortTransformationOptionsComponent({
  sortData,
  headers,
  onSortDataChange,
}: SortTransformationOptionsComponentProps) {
  const [sortDataCopy, setSortDataCopy] = useState<SortData[] | null>(null);

  useEffect(() => {
    if (!!sortData) {
      setSortDataCopy(JSON.parse(JSON.stringify(sortData)));
    }
    setSortDataCopy((prev) => {
      if (!!prev) return prev;
      return [{ column: "", direction: "asc" }] as SortData[];
    });
  }, [sortData]);

  const handleAddSortColumnClick = () => {
    if (sortDataCopy && sortDataCopy.length >= 3) {
      alert("Max 3 columns can be sorted");
      return;
    }
    setSortDataCopy((prev) => {
      if (!!prev) {
        return [...prev, { column: "", direction: "asc" }] as SortData[];
      } else {
        return [{ column: "", direction: "asc" }] as SortData[];
      }
    });
  };

  const handleSortColumnChange =
    (index: number) => (e: ChangeEvent<HTMLSelectElement>) => {
      if (!sortDataCopy) return;
      setSortDataCopy((prev) => {
        if (!prev) return prev;
        const newSortData = [...prev];
        newSortData[index].column = e.target.value;
        return newSortData;
      });
    };

  const handleSortDirectionChange =
    (index: number) => (e: ChangeEvent<HTMLSelectElement>) => {
      if (!sortDataCopy) return;
      setSortDataCopy((prev) => {
        if (!prev) return prev;
        const newSortData = [...prev];
        newSortData[index].direction = e.target.value as SortDirection;
        return newSortData;
      });
    };

  const handleDeleteSortColumnClick = (index: number) => () => {
    if (!sortDataCopy || sortDataCopy.length == 1) return;
    setSortDataCopy((prev) => {
      if (!prev) return prev;
      const newSortData = [...prev];
      newSortData.splice(index, 1);
      return newSortData;
    });
  };

  const handleApplyClick = () => {
    if (!isSortDataValid()) return;
    onSortDataChange(sortDataCopy as SortData[]);
  };

  const isSortDataValid = () => {
    if (!sortDataCopy) return false;
    const allColumnsFilled = sortDataCopy.every(
      (sortData) => !!sortData.column
    );
    if (!allColumnsFilled) {
      alert("Please fill all columns");
      return false;
    }
    const areColumnsunique =
      new Set(sortDataCopy.map((sortData) => sortData.column)).size !==
      sortDataCopy.length;
    if (areColumnsunique) {
      alert("Columns must be unique");
      return false;
    }
    return true;
  };
  return (
    <>
      <div className="flex flex-col gap-2">
        <div>Select Columns To Sort (Max 3 columns)</div>
        {sortDataCopy?.map((sortData, index) => {
          return (
            <div key={index} className="flex items-center gap-2">
              <select
                value={sortData.column}
                onChange={handleSortColumnChange(index)}
              >
                <option value="">Select Column</option>
                {headers.map((header) => (
                  <option key={header.name} value={header.name}>
                    {header.name}
                  </option>
                ))}
              </select>
              <select
                value={sortData.direction}
                onChange={handleSortDirectionChange(index)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              <MdDelete
                className="cursor-pointer h-full text-danger"
                onClick={handleDeleteSortColumnClick(index)}
              />
            </div>
          );
        })}
        <button className="bg-primary p-2" onClick={handleAddSortColumnClick}>
          Add Sort Column
        </button>

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
