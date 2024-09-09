"use client";

import TableTabComponent from "@/components/TableTab/TableTab";
import TransformationsComponent from "@/components/Transformations/Transformations";
import { useAppSelector } from "@/lib/hooks";

export default function TransformPage() {
  const transformedCsvData = useAppSelector(
    (state) => state.app.transformedCsvData
  );

  return (
    <>
      <TransformationsComponent />
      <TableTabComponent csvData={transformedCsvData} />
    </>
  );
}
