import { CSVData } from "@/models/CSVData";
import { createContext } from "react";

export const AppContext = createContext<{ csvData: CSVData } | null>(null);
