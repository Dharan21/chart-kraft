"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type DropdownMenuCheckboxOption = {
  label: string;
  checked: boolean;
};

type DropdownMenuCheckboxesProps = {
  label: string;
  options: DropdownMenuCheckboxOption[];
  onCheckedChange: (updatedOptions: DropdownMenuCheckboxOption[]) => void;
};

export function DropdownMenuCheckboxes({
  label,
  options,
  onCheckedChange,
}: DropdownMenuCheckboxesProps) {
  const handleCheckedChange = (index: number) => (checked: boolean) => {
    const updatedOptions = options.map((option, i) =>
      i === index ? { ...option, checked } : option
    );
    onCheckedChange(updatedOptions);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {options.map((option, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            checked={option.checked}
            onCheckedChange={handleCheckedChange(index)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
