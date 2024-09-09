import { Header, SupportedDataType } from "@/models/CSVData";
import { AggregateOption } from "@/models/GroupByOptions";
import { AggregateData, GroupData } from "@/models/Transformation";
import { ChangeEvent, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

type GroupTransformationOptionsComponentProps = {
  groupData: GroupData;
  headers: Header[];
  onGroupDataChange: (data: GroupData) => void;
};
export default function GroupTransformationsOptionsComponent({
  groupData,
  headers,
  onGroupDataChange,
}: GroupTransformationOptionsComponentProps) {
  const [groupDataCopy, setGroupDataCopy] = useState<GroupData | null>(null);

  useEffect(() => {
    if (!!groupData) {
      setGroupDataCopy(JSON.parse(JSON.stringify(groupData)));
      setGroupDataCopy((prev) => {
        if (!!prev) {
          let columns = prev.columns;
          columns.push("", "", "");
          return {
            ...prev,
            columns: prev.columns.slice(0, 3),
          };
        }
        return {
          columns: ["", "", ""],
          aggregateData: [
            { column: "", aggregateOption: "" as AggregateOption },
          ] as AggregateData[],
        } as GroupData;
      });
    }
    setGroupDataCopy((prev) => {
      if (!!prev) return prev;
      return {
        columns: ["", "", ""],
        aggregateData: [
          { column: "", aggregateOption: "" as AggregateOption },
        ] as AggregateData[],
      } as GroupData;
    });
  }, [groupData]);

  const handleGroupDataColumnChange = (index: number) => (value: string) => {
    setGroupDataCopy((prev) => {
      if (!prev) return prev;
      const newGroupData = { ...prev };
      newGroupData.columns[index] = value;
      return newGroupData;
    });
  };

  const handleAddAggregate = () => {
    if (!groupDataCopy) return;
    setGroupDataCopy((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        aggregateData: [
          ...prev.aggregateData,
          { column: "", aggregateOption: "" as AggregateOption },
        ],
      };
    });
  };

  const handleRemoveAggregate = (index: number) => {
    if (!groupDataCopy || groupDataCopy.aggregateData.length === 1) return;
    setGroupDataCopy((prev) => {
      if (!prev) return prev;
      const newAggregateData = [...prev.aggregateData];
      newAggregateData.splice(index, 1);
      return {
        ...prev,
        aggregateData: newAggregateData,
      };
    });
  };

  const handleAggregateColumnChange = (index: number) => (value: string) => {
    if (!groupDataCopy) return;
    setGroupDataCopy((prev) => {
      if (!prev) return prev;
      const newAggregateData = [...prev.aggregateData];
      newAggregateData[index].column = value;
      return {
        ...prev,
        aggregateData: newAggregateData,
      };
    });
  };

  const handleAggregateFunctionChange =
    (index: number) => (value: AggregateOption) => {
      if (!groupDataCopy) return;
      setGroupDataCopy((prev) => {
        if (!prev) return prev;
        const newAggregateData = [...prev.aggregateData];
        newAggregateData[index].aggregateOption = value;
        return {
          ...prev,
          aggregateData: newAggregateData,
        };
      });
    };

  const availableColumnsForAggregation = (index: number) => {
    if (!groupDataCopy) return [];
    return headers.filter(
      (header) =>
        header.type === SupportedDataType.Number &&
        !groupDataCopy.columns.includes(header.name) &&
        !groupDataCopy.aggregateData
          .filter((_, i) => i !== index)
          .map((opt) => opt.column)
          .includes(header.name)
    );
  };

  const handleApplyClick = () => {
    if (!!checkIfGroupDataValid()) {
      onGroupDataChange({
        ...groupDataCopy,
        columns: groupDataCopy?.columns.filter((column) => !!column),
      } as GroupData);
    }
  };

  const checkIfGroupDataValid = () => {
    if (!groupDataCopy) return false;
    const filledColumns = groupDataCopy.columns.filter((column) => !!column);
    if (filledColumns.length > 0) {
      const allColumnsUnique =
        new Set(filledColumns).size === filledColumns.length;
      if (!allColumnsUnique) {
        alert("Columns should be unique");
        return false;
      }
    } else {
      alert("Please select at least one column to group by");
      return false;
    }
    const allAggregatesFilled = groupDataCopy.aggregateData.every(
      (aggregate) => !!aggregate.column && !!aggregate.aggregateOption
    );
    if (!allAggregatesFilled) {
      alert("Please fill all aggregates");
      return false;
    }
    return true;
  };

  return (
    <div className="flex flex-col gap-2 w-full md:min-w-[40vw]">
      <div className="font-semibold">Select Columns To Group</div>
      <div className="flex items-center gap-2">
        {groupDataCopy?.columns.map((column, index) => {
          return (
            <Select
              key={index}
              value={column}
              onValueChange={handleGroupDataColumnChange(index)}
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
          );
        })}
      </div>

      {!!groupDataCopy &&
        groupDataCopy.columns.length > 0 &&
        groupDataCopy.aggregateData.length > 0 && (
          <>
            <div className="font-semibold">Aggregate Functions</div>
            {groupDataCopy.aggregateData.map((aggregate, i) => (
              <div className="flex gap-2 items-end" key={i}>
                <div className="w-6/12 flex flex-col">
                  <Select
                    name={`aggr-col-${i}`}
                    value={aggregate.column}
                    onValueChange={handleAggregateColumnChange(i)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Column" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColumnsForAggregation(i).map((header) => (
                        <SelectItem key={header.name} value={header.name}>
                          {header.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-5/12 flex flex-col">
                  <Select
                    name={`aggr-fn-${i}`}
                    value={aggregate.aggregateOption}
                    onValueChange={handleAggregateFunctionChange(i)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Function" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AggregateOption).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-1/12">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleRemoveAggregate(i)}
                  >
                    <MdDelete />
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}
      <Button type="button" variant="secondary" onClick={handleAddAggregate}>
        Add Aggregate Function
      </Button>
      <Button type="button" onClick={handleApplyClick}>
        Apply
      </Button>
    </div>
  );
}
