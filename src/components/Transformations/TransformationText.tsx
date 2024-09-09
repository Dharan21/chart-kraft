"use client";

import { FilterData, GroupData, SortData } from "@/models/Transformation";
import { PropsWithChildren } from "react";

type TransfomrationTextFragmentProps = {
  rowsCount: number;
};

interface FilterTransformationTextComponentProps
  extends TransfomrationTextFragmentProps {
  filterData: FilterData;
}

export function FilterTransformationTextComponent({
  filterData,
  rowsCount,
}: FilterTransformationTextComponentProps) {
  return (
    <TransfomrationTextFragment rowsCount={rowsCount}>
      <div className="font-semibold">Filter</div>
      {filterData?.column} {filterData?.operator} {filterData?.value}
    </TransfomrationTextFragment>
  );
}

interface SortTransformationTextComponentProps
  extends TransfomrationTextFragmentProps {
  sortData: SortData[];
}

export function SortTransformationTextComponent({
  sortData,
  rowsCount,
}: SortTransformationTextComponentProps) {
  return (
    <TransfomrationTextFragment rowsCount={rowsCount}>
      <div className="font-semibold">Sort</div>
      {sortData?.map((sort, index) => (
        <div key={index}>
          {sort.column} {sort.direction}
        </div>
      ))}
    </TransfomrationTextFragment>
  );
}

interface GroupTransformationTextComponentProps
  extends TransfomrationTextFragmentProps {
  groupData: GroupData;
}

export function GroupTransformationTextComponent({
  groupData,
  rowsCount,
}: GroupTransformationTextComponentProps) {
  return (
    <TransfomrationTextFragment rowsCount={rowsCount}>
      <div className="font-semibold">Group By</div>
      <div>{groupData?.columns.join(", ")}</div>
      Aggregations On:
      {groupData?.aggregateData
        .map((agg) => `${agg.column} - ${agg.aggregateOption}`)
        .map((item, index) => (
          <div key={index}>{item}</div>
        ))}
    </TransfomrationTextFragment>
  );
}

function TransfomrationTextFragment({
  rowsCount,
  children,
}: PropsWithChildren<TransfomrationTextFragmentProps>) {
  return (
    <div className=" flex flex-col">
      <div>{children}</div>
      <div className=" flex justify-end">{rowsCount} Rows Selected</div>
    </div>
  );
}
