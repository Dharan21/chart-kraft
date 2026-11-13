"use client";

import { useState } from "react";
import {
  Upload,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Plus,
  FileSpreadsheet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  convertCSVDataToSpecficTypes,
  parseCSV,
  validateCSVData,
  describeErrorLines,
} from "@/utils/utility-functions";
import { CSVData, SupportedDataType } from "@/models/CSVData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { resetTabs, setUploadedCsvData } from "@/lib/features/appSlice";
import { useRouter } from "next/navigation";
import * as CONSTANTS from "@/utils/constants";
import { notify } from "@/components/Feedback/feedback";

type ColumnData = {
  header: string;
  type: SupportedDataType;
  sampleData: string[];
};

export default function Component() {
  const [currentStep, setCurrentStep] = useState(1);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [csvData, setCSVData] = useState<CSVData>({ headers: [], rows: [] });
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();

  const loadCsvText = (
    contents: string,
    name: string,
    presetTypes: Record<string, SupportedDataType> = {}
  ) => {
    const csv = parseCSV(contents);
    const sampleRows = csv.rows
      .slice(0, 3)
      .map((row) => Object.values(row) as string[]);
    setCSVData(csv);
    setColumns(
      csv.headers.map((header, index) => ({
        header: header.name,
        type: presetTypes[header.name] ?? SupportedDataType.String,
        sampleData: sampleRows.map((row) => row[index]),
      }))
    );
    setAvailableColumns([]);
    setFileName(name);
  };

  const processFile = (file: File): boolean => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      notify("Please select a .csv file.");
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => loadCsvText(e.target?.result as string, file.name);
    reader.onerror = () => notify("Could not read that file.");
    reader.readAsText(file);
    return true;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!processFile(file)) event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleUseSample = async () => {
    setIsLoadingSample(true);
    try {
      const res = await fetch("/sample-sales.csv");
      if (!res.ok) throw new Error(res.statusText);
      loadCsvText(await res.text(), "sample-sales.csv", {
        Date: SupportedDataType.Date,
        "Units Sold": SupportedDataType.Number,
        Revenue: SupportedDataType.Number,
        "Profit Margin": SupportedDataType.Number,
      });
      setCurrentStep(2);
    } catch {
      notify("Could not load the sample data.");
    } finally {
      setIsLoadingSample(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && fileName) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTypeChange = (index: number, type: SupportedDataType) => {
    setColumns((prev) =>
      prev.map((col, i) => (i === index ? { ...col, type } : col))
    );
  };

  const addColumn = (columnName: string) => {
    const sampleData = csvData.rows
      .slice(0, 3)
      .map((row) => row[columnName] as string);
    setColumns((prev) => [
      ...prev,
      {
        header: columnName,
        type: SupportedDataType.String,
        sampleData: sampleData,
      },
    ]);
    setAvailableColumns((prev) => prev.filter((col) => col !== columnName));
  };

  const removeColumn = (index: number) => {
    setAvailableColumns((prev) => [...prev, columns[index].header]);
    setColumns((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartCraftingClick = () => {
    // Validate
    let isValidated = false;
    const selectedDataTypes = columns
      .map((col) => ({ header: col.header, dataType: col.type }))
      .reduce((acc, curr) => {
        acc[curr.header] = curr.dataType;
        return acc;
      }, {} as { [key: string]: SupportedDataType });
    const errorLineNos = validateCSVData(csvData, selectedDataTypes);
    if (errorLineNos.length > 0) {
      notify(describeErrorLines(errorLineNos));
    } else {
      isValidated = true;
    }

    if (isValidated) {
      // Start Crafting
      const selectedDataTypes = columns.map((col) => ({
        header: col.header,
        dataType: col.type,
      }));
      const data = convertCSVDataToSpecficTypes(csvData, selectedDataTypes);
      dispatch(setUploadedCsvData(data));
      router.replace(CONSTANTS.ROUTES.CRAFTROUTES.TRANSFORM);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <section className="py-6 text-center sm:py-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Turn any CSV into charts, right in your browser
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Upload a CSV, then filter, sort and group your data and build bar,
          line and pie charts. Free, no sign-up, and your data never leaves
          your device.
        </p>
        <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <li>Typed columns: String, Number, Date</li>
          <li>Filter, sort and group by</li>
          <li>Bar, line and pie charts</li>
          <li>100% private, runs locally</li>
        </ul>
      </section>
    <Card className="w-full">
      <CardHeader>
        <CardTitle>CSV Data Import - Step {currentStep} of 2</CardTitle>
      </CardHeader>
      <CardContent>
        {currentStep === 1 ? (
          <div className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                isDragging ? "border-primary bg-accent" : "border-input"
              }`}
            >
              <Upload className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <Label htmlFor="csv-upload" className="text-base">
                Drag and drop a CSV file here, or choose one
              </Label>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="max-w-xs cursor-pointer"
                aria-describedby="csv-upload-hint"
              />
              <p id="csv-upload-hint" className="text-xs text-muted-foreground">
                First row must be column headers. Your file is processed in this
                browser and is never uploaded.
              </p>
            </div>
            {fileName && (
              <div className="text-sm text-muted-foreground" role="status">
                File ready: {fileName}
              </div>
            )}
            <div className="flex items-center gap-3 pt-2 text-sm text-muted-foreground">
              <span>No file handy?</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUseSample}
                disabled={isLoadingSample}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                {isLoadingSample ? "Loading..." : "Use sample sales data"}
              </Button>
              <a
                href="/sample-sales.csv"
                download
                className="underline underline-offset-4"
              >
                Download it
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Header</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Sample Data</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {columns.map((column, index) => (
                  <TableRow key={index}>
                    <TableCell>{column.header}</TableCell>
                    <TableCell>
                      <Select
                        value={column.type}
                        onValueChange={(value: SupportedDataType) =>
                          handleTypeChange(index, value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select data type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(SupportedDataType).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={value}>
                                {value}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {column.sampleData.map((row, rowIndex) => (
                        <span key={rowIndex} className="block">
                          {row}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeColumn(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove column</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={availableColumns.length === 0}>
                  <Plus className="mr-2 h-4 w-4" /> Add Column
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {availableColumns.map((column, index) => (
                  <DropdownMenuItem
                    key={index}
                    onSelect={() => addColumn(column)}
                  >
                    Add Column - {column}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        {currentStep == 1 && (
          <Button onClick={handleNext} disabled={!fileName}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        {currentStep == 2 && (
          <Button onClick={handleStartCraftingClick}>
            Start Crafting
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
    </div>
  );
}
