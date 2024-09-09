"use client";

import { useState } from "react";
import { Upload, ChevronRight, ChevronLeft, Trash2, Plus } from "lucide-react";

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

type ColumnData = {
  header: string;
  type: SupportedDataType;
  sampleData: string[];
};

export default function Component() {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [csvData, setCSVData] = useState<CSVData>({ headers: [], rows: [] });
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileNameParts = file.name.split(".");
    const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();

    if (fileExtension === "csv") {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target?.result as string;
        const csv = parseCSV(contents);
        const extractedHeaders = csv.headers.map((header) => header.name);
        const extractedSampleData = csv.rows
          .slice(0, 3)
          .map((row) => Object.values(row) as string[]);
        setCSVData(csv);
        const newColumns = extractedHeaders.map((header, index) => ({
          header,
          type: SupportedDataType.String,
          sampleData: extractedSampleData.map((row) => row[index]),
        }));
        setColumns(newColumns);
        setAvailableColumns([]);
      };
      reader.readAsText(file);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && file) {
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
      alert("errorLineNos: " + errorLineNos.join(", "));
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>CSV Data Import - Step {currentStep} of 2</CardTitle>
      </CardHeader>
      <CardContent>
        {currentStep === 1 ? (
          <div className="space-y-4">
            <Label htmlFor="csv-upload">Upload CSV File</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
              />
              <Button size="icon">
                <Upload className="h-4 w-4" />
                <span className="sr-only">Upload CSV</span>
              </Button>
            </div>
            {file && (
              <div className="text-sm text-muted-foreground">
                File uploaded: {file.name}
              </div>
            )}
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
          <Button onClick={handleNext} disabled={!file}>
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
  );
}
