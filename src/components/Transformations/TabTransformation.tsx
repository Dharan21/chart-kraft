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
import { useAppSelector } from "@/lib/hooks";
import { useDispatch } from "react-redux";
import {
  updateTabData,
  updateTabTransformations,
} from "@/lib/features/appSlice";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { TabData } from "@/models/TabData";

export default function TabTransformationsComponent() {
  const currentTabIndex = useAppSelector((state) => state.app.currentTabIndex);
  const tabsData = useAppSelector((state) => state.app.tabsData);
  const tabData = tabsData[currentTabIndex];
  const transformations = tabData.transformations;
  const csvData = tabData.inputData;
  const dispatch = useDispatch();

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const addTransformation = (type: TransformationType) => {
    const index = transformations.length;
    if (!isAllowedToAddTransformation(index)) {
      alert("Complete the previous transformations first");
      return;
    }
    const newTransformations: Transformation[] = [...transformations];
    if (index == 0) {
      newTransformations.push({
        inputData: csvData,
        type,
      } as Transformation);
    } else {
      newTransformations.push({
        inputData: newTransformations[newTransformations.length - 1].outputData,
        type,
      } as Transformation);
    }

    dispatch(updateTabTransformations(newTransformations));
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
    let newTransformations = [...transformations];
    newTransformations.splice(index);
    if (index == 0) {
      newTransformations = [{ inputData: csvData } as Transformation];
    }
    dispatch(updateTabTransformations(newTransformations));
  };

  const handleTransformationDialogClose = (data?: Transformation) => {
    if (!!data && !!(data as Transformation)?.outputData) {
      const newTransformations = [...transformations];
      newTransformations[selectedIndex] = data;
      dispatch(updateTabTransformations(newTransformations));
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
    if (transformations.length == 0) return;
    if (isAllowedToAddTransformation(transformations.length - 1)) {
      const outputData = transformations[transformations.length - 1].outputData;
      if (!!outputData) {
        // handleTransformedData(outputData);
        const updatedTabData: TabData = {
          ...tabData,
          transformedData: outputData,
        };
        dispatch(updateTabData({ index: currentTabIndex, updatedTabData }));
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
    dispatch(updateTabTransformations([]));
    // handleTransformedData(csvData);
  };

  return (
    <>
      {isDialogOpen && (
        <TransformationsSelectionDialogComponent
          isOpen={isDialogOpen}
          onClose={handleTransformationDialogClose}
          transformation={transformations[selectedIndex]}
        />
      )}
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold">Transformations</div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => addTransformation(TransformationType.Filter)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Filter
          </Button>
          <Button
            variant="outline"
            onClick={() => addTransformation(TransformationType.Sort)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Sort
          </Button>
          <Button
            variant="outline"
            onClick={() => addTransformation(TransformationType.Group)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Group By
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {transformations.map((transformation, index) => (
            <TransformationBoxComponent
              key={index}
              isDisplayPrevAdd={false}
              isDisplayNextAdd={false}
              isDeleteDisabled={transformations.length == 1 && index == 0}
              // handlePrevAdd={() => addTransformation(index)}
              // handleNextAdd={() => addTransformation(index + 1)}
              handlePrevAdd={() => {}}
              handleNextAdd={() => {}}
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
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleApplyTransformationsClick}>
            Apply Transformations
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleResetTransformationsClick}
          >
            Reset Transformations
          </Button>
        </div>
      </div>
    </>
  );
}
