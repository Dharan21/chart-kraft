"use client";

import { useState } from "react";
import TransformationBoxComponent from "./TransformationBox";
import {
  FilterData,
  GroupData,
  SortData,
  Transformation,
  TransformationType,
} from "@/models/Transformation";
import TransformationsSelectionDialogComponent from "./TransformationsSelectionDialog";
import { CSVData } from "@/models/CSVData";
import {
  FilterTransformationTextComponent,
  GroupTransformationTextComponent,
  SortTransformationTextComponent,
} from "./TransformationText";

type TransformationsProps = {
  csvData: CSVData;
  handleTransformedData: (data: CSVData) => void;
};

export default function TransformationsComponent({
  csvData,
  handleTransformedData,
}: TransformationsProps) {
  const [transformations, setTransformations] = useState<Transformation[]>([
    { inputData: csvData } as Transformation,
  ]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const addTransformation = (index: number) => {
    if (!isAllowedToAddTransformation(index)) {
      alert("Complete the previous transformations first");
      return;
    }
    setTransformations((prev) => {
      const newTransformations = [...prev];
      if (index >= 0 && index < newTransformations.length) {
        const inputCsvData =
          index == 0 ? csvData : newTransformations[index - 1].outputData;
        newTransformations.splice(index, 0, {
          inputData: inputCsvData,
        } as Transformation);
      } else {
        newTransformations.push({
          inputData:
            newTransformations[newTransformations.length - 1].outputData,
        } as Transformation);
      }

      return newTransformations;
    });
  };

  const handleEditTransformation = (index: number) => {
    setSelectedIndex(index);
    setIsDialogOpen(true);
  };

  const handleDeleteTransformation = (index: number) => {
    if (transformations.length == 1) {
      return;
    }
    const res = confirm(
      "You will lose all transformations after this. Are you sure?"
    );
    if (!res) return;
    setTransformations((prev) => {
      let newTransformations = [...prev];
      newTransformations.splice(index);
      if (index == 0) {
        newTransformations = [{ inputData: csvData } as Transformation];
      }
      return newTransformations;
    });
  };

  const handleTransformationDialogClose = (data?: Transformation) => {
    if (!!data && !!(data as Transformation)?.outputData) {
      setTransformations((prev) => {
        const newTransformations = [...prev];
        newTransformations[selectedIndex] = data;
        return newTransformations;
      });
    }

    setIsDialogOpen(false);
    setSelectedIndex(-1);
  };

  const isAllowedToAddTransformation = (index: number): boolean => {
    if (index == 0) {
      return true;
    } else {
      return !!transformations[index - 1].outputData;
    }
  };

  const handleApplyTransformationsClick = () => {
    if (isAllowedToAddTransformation(transformations.length - 1)) {
      const outputData = transformations[transformations.length - 1].outputData;
      if (!!outputData) {
        handleTransformedData(outputData);
      } else {
        alert(
          "Could not apply transformations. Some transformations are incomplete."
        );
      }
    } else {
      alert(
        "Could not apply transformations. Some transformations are incomplete."
      );
    }
  };

  const handleResetTransformationsClick = () => {
    setTransformations([{ inputData: csvData } as Transformation]);
    handleTransformedData(csvData);
  };

  return (
    <>
      <TransformationsSelectionDialogComponent
        isOpen={isDialogOpen}
        onClose={handleTransformationDialogClose}
        transformation={transformations[selectedIndex]}
      />
      <div className="text-center mb-2">Transformations</div>
      {transformations.map((transformation, index) => (
        <TransformationBoxComponent
          key={index}
          isDisplayPrevAdd={index == 0}
          isDisplayNextAdd={index == transformations.length - 1}
          isDeleteDisabled={transformations.length == 1 && index == 0}
          handlePrevAdd={() => addTransformation(index)}
          handleNextAdd={() => addTransformation(index + 1)}
          onEdit={() => handleEditTransformation(index)}
          onDelete={() => handleDeleteTransformation(index)}
        >
          {!!transformation && (
            <>
              {transformation.type == TransformationType.Filter && (
                <FilterTransformationTextComponent
                  filterData={transformation.data as FilterData}
                  rowsCount={transformation.outputData?.rows.length ?? 0}
                />
              )}
              {transformation.type == TransformationType.Sort && (
                <SortTransformationTextComponent
                  sortData={transformation.data as SortData[]}
                  rowsCount={transformation.outputData?.rows.length ?? 0}
                />
              )}
              {transformation.type == TransformationType.Group && (
                <GroupTransformationTextComponent
                  groupData={transformation.data as GroupData}
                  rowsCount={transformation.outputData?.rows.length ?? 0}
                />
              )}
            </>
          )}
        </TransformationBoxComponent>
      ))}
      <button
        className="bg-primary p-2 font-semibold mt-6"
        onClick={handleApplyTransformationsClick}
      >
        Apply Transformations
      </button>
      <button
        className="bg-danger p-2 font-semibold mt-2"
        onClick={handleResetTransformationsClick}
      >
        Reset Transformations
      </button>
    </>
  );
}
