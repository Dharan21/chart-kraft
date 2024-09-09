import { PropsWithChildren } from "react";

export default function ChartFragement({ children }: PropsWithChildren) {
  return (
    <div className="bg-slate-200 p-8 rounded-lg h-full">
      <div className="w-full h-full flex items-center justify-center text-slate-800">
        {children}
      </div>
    </div>
  );
}
