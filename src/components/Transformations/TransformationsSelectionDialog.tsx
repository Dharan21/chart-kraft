"use client";

import {
  FilterData,
  GroupData,
  SortData,
  Transformation,
  TransformationType,
} from "@/models/Transformation";
import DialogComponent from "../Dialog/Dialog";
import { useEffect, useState } from "react";
import FilterTransformationOptionsComponent from "./FilterTransformationOptions";
import {
  applyFilterTransform,
  applyGroupTransform,
  applySortTransform,
} from "@/utils/utility-functions";
import SortTransformationOptionsComponent from "./SortTransformationOptions";
import GroupTransformationsOptionsComponent from "./GroupTransformationsOptions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type TransformationsSelectionDialogProps = {
  isOpen: boolean;
  onClose: (data?: Transformation) => void;
  transformation: Transformation | null;
};

export default function TransformationsSelectionDialogComponent({
  isOpen,
  onClose,
  transformation,
}: TransformationsSelectionDialogProps) {
  const [transformationObject, setTransformationObject] =
    useState<Transformation>({} as Transformation);

  useEffect(() => {
    if (!!transformation) {
      setTransformationObject(JSON.parse(JSON.stringify(transformation)));
    }
  }, [transformation]);

  const handleTransformationTypeChange = (type: TransformationType) => {
    setTransformationObject((prev) => {
      return {
        ...prev,
        type: type,
      };
    });
  };

  const handleFilterDataChange = (data: FilterData) => {
    const inputData = transformationObject.inputData;
    if (!inputData) return;
    const outputData = applyFilterTransform(inputData, data);
    onClose({
      ...transformationObject,
      data: data,
      outputData: outputData,
      isApplied: true,
    });
  };

  const handleSortDataChange = (data: SortData[]) => {
    const inputData = transformationObject.inputData;
    if (!inputData) return;
    const outputData = applySortTransform(inputData, data);
    onClose({
      ...transformationObject,
      data: data,
      outputData: outputData,
      isApplied: true,
    });
  };

  const handleGroupDataChange = (data: GroupData) => {
    const inputData = transformationObject.inputData;
    if (!inputData) return;
    const outputData = applyGroupTransform(inputData, data);
    onClose({
      ...transformationObject,
      data: data,
      outputData: outputData,
      isApplied: true,
    });
  };

  if (
    !transformation ||
    !transformation.inputData ||
    transformation.inputData.rows.length === 0
  ) {
    return (
      <DialogComponent isOpen={isOpen} onClose={onClose}>
        <div className="text-center">No data to transform</div>
      </DialogComponent>
    );
  }

  return (
    <>
      <DialogComponent isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-col gap-4">
          <div className="font-bold">Edit Transformation</div>
          <Select
            value={transformationObject?.type || ""}
            onValueChange={handleTransformationTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Transformation Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(TransformationType).map((key) => (
                <SelectItem
                  key={key}
                  value={
                    TransformationType[key as keyof typeof TransformationType]
                  }
                >
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!!transformationObject?.inputData && (
            <>
              <hr />
              {transformationObject?.type == TransformationType.Filter && (
                <FilterTransformationOptionsComponent
                  filterData={transformationObject.data as FilterData}
                  headers={transformationObject.inputData.headers}
                  onFilterDataChange={handleFilterDataChange}
                />
              )}
              {transformationObject?.type == TransformationType.Sort && (
                <SortTransformationOptionsComponent
                  sortData={transformationObject.data as SortData[]}
                  headers={transformationObject.inputData.headers}
                  onSortDataChange={handleSortDataChange}
                />
              )}
              {transformationObject?.type == TransformationType.Group && (
                <GroupTransformationsOptionsComponent
                  groupData={transformationObject.data as GroupData}
                  headers={transformationObject.inputData.headers}
                  onGroupDataChange={handleGroupDataChange}
                />
              )}
            </>
          )}
        </div>
      </DialogComponent>
    </>
  );
}
