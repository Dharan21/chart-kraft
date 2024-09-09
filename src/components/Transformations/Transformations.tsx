"use client";

import { useEffect, useState } from "react";
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
  addGlobalTransformation,
  applyGlobalTransformations,
  deleteGlobalTransformation,
  resetGlobalTransformations,
  updateGlobalTransformation,
} from "@/lib/features/appSlice";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function TransformationsComponent() {
  const transformations = useAppSelector(
    (state) => state.app.globalTransformations
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const addTransformation = (type: TransformationType) => {
    if (isAllowedToAddTransformation(transformations.length)) {
      dispatch(addGlobalTransformation(type));
    } else {
      alert("Complete the previous transformations first");
    }
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
    dispatch(deleteGlobalTransformation(index));
  };

  const handleTransformationDialogClose = (data?: Transformation) => {
    if (!!data && !!(data as Transformation)?.outputData) {
      dispatch(
        updateGlobalTransformation({
          index: selectedIndex,
          transformation: data,
        })
      );
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
        if (
          confirm(
            "This action will reset your tabs data. Are you sure you want to proceed?"
          )
        ) {
          dispatch(applyGlobalTransformations());
        }
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
    dispatch(resetGlobalTransformations());
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
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="font-bold text-2xl">Data Transformations</div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => addTransformation(TransformationType.Filter)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Filter
            </Button>
            <Button onClick={() => addTransformation(TransformationType.Sort)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Sort
            </Button>
            <Button onClick={() => addTransformation(TransformationType.Group)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Group By
            </Button>
          </div>
          {transformations && transformations.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {transformations.map((transformation, index) => (
                <TransformationBoxComponent
                  key={index}
                  isDisplayPrevAdd={false}
                  isDisplayNextAdd={false}
                  isDeleteDisabled={transformations.length == 1 && index == 0}
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
                          rowsCount={
                            transformation.outputData?.rows.length ?? 0
                          }
                        />
                      )}
                      {transformation.type == TransformationType.Sort && (
                        <SortTransformationTextComponent
                          sortData={transformation.data as SortData[]}
                          rowsCount={
                            transformation.outputData?.rows.length ?? 0
                          }
                        />
                      )}
                      {transformation.type == TransformationType.Group && (
                        <GroupTransformationTextComponent
                          groupData={transformation.data as GroupData}
                          rowsCount={
                            transformation.outputData?.rows.length ?? 0
                          }
                        />
                      )}
                    </>
                  )}
                </TransformationBoxComponent>
              ))}
            </div>
          )}
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
        </CardContent>
      </Card>
    </>
  );
}
