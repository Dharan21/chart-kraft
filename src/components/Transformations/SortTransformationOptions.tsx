import { Header } from "@/models/CSVData";
import { SortData, SortDirection } from "@/models/Transformation";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

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

  const handleSortColumnChange = (index: number) => (value: string) => {
    if (!sortDataCopy) return;
    setSortDataCopy((prev) => {
      if (!prev) return prev;
      const newSortData = [...prev];
      newSortData[index].column = value;
      return newSortData;
    });
  };

  const handleSortDirectionChange = (index: number) => (value: string) => {
    if (!sortDataCopy) return;
    setSortDataCopy((prev) => {
      if (!prev) return prev;
      const newSortData = [...prev];
      newSortData[index].direction = value as SortDirection;
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
      <div className="flex flex-col gap-2 w-full md:min-w-[40vw]">
        <div className="font-semibold">
          Select Columns To Sort (Max 3 columns)
        </div>
        {sortDataCopy?.map((sortData, index) => {
          return (
            <div key={index} className="flex items-center gap-2">
              <Select
                value={sortData.column}
                onValueChange={handleSortColumnChange(index)}
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
                value={sortData.direction}
                onValueChange={handleSortDirectionChange(index)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={handleDeleteSortColumnClick(index)}
              >
                <MdDelete />
              </Button>
            </div>
          );
        })}
        <Button variant="secondary" onClick={handleAddSortColumnClick}>
          Add Sort Column
        </Button>
        <Button onClick={handleApplyClick}>Apply</Button>
      </div>
    </>
  );
}
