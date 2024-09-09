"use client";

import { BarChartIcon, FilterIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import * as CONSTANTS from "@/utils/constants";
import { useAppSelector } from "@/lib/hooks";

export default function CraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = useAppSelector((state) => state.app.uploadedCsvData);
  const route = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!data || data.rows.length === 0) {
      router.replace("/");
    }
  }, [data]);

  const getLinkClass = (routeName: string) => {
    const isSelected = route && route.includes(routeName);
    return `flex items-center gap-3 rounded-lg px-3 py-2 transition-all justify-center ${
      isSelected ? "bg-primary text-background" : "text-secondary-foreground"
    }`;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row">
        <aside className="sm:border-r sm:block">
          <div className="flex flex-col gap-2 p-4">
            <Link
              href={CONSTANTS.ROUTES.CRAFTROUTES.TRANSFORM}
              className={getLinkClass(CONSTANTS.ROUTES.CRAFTROUTES.TRANSFORM)}
              prefetch={false}
            >
              <FilterIcon className="h-4 w-4" />
              <span>Transform</span>
            </Link>
            <Link
              href={CONSTANTS.ROUTES.CRAFTROUTES.VISUALIZE}
              className={getLinkClass(CONSTANTS.ROUTES.CRAFTROUTES.VISUALIZE)}
              prefetch={false}
            >
              <BarChartIcon className="h-4 w-4" />
              <span>Visualize</span>
            </Link>
          </div>
        </aside>
        <main className="flex flex-col gap-4 p-4 pt-0 md:gap-8 md:p-6 md:pt-4">
          {children}
        </main>
      </div>
    </>
  );
}
