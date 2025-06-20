"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/DataTableCommons/data-table-view-options";
import { ObjectType } from "@/types/object/types";
import { Badge } from "@/components/ui/badge";

interface DataTableSimpleToolbarProps {
  table: Table<ObjectType>;
}

const typeTranslations: Record<string, string> = {
  Organization: "Organizacja",
  Unit: "Jednostka",
  Room: "Pokój",
  Bed: "Łóżko",
};

export function DataTableToolbar({ table }: DataTableSimpleToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const allRows = table.getCoreRowModel().rows.map((row) => row.original);
  const availableTypes = Array.from(new Set(allRows.map((r) => r.type)));
  const availableLevels = Array.from(new Set(allRows.map((r) => r.level)));

  const selectedType = table.getColumn("type")?.getFilterValue() as string | undefined;
  const selectedLevel = table.getColumn("level")?.getFilterValue() as string | undefined;

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Filtrowanie po nazwie */}
        <Input
          placeholder="Filtruj nazwę..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* Tagi typu */}
        {availableTypes.map((type) => (
          <Badge
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            onClick={() =>
              table.getColumn("type")?.setFilterValue(
                selectedType === type ? "" : type
              )
            }
            className="cursor-pointer"
          >
            {typeTranslations[type] ?? type}
          </Badge>
        ))}

        {/* Tagi poziomu */}
        {availableLevels.map((level) => {
          const levelStr = String(level);
          return (
            <Badge
              key={levelStr}
              variant={selectedLevel === levelStr ? "default" : "outline"}
              onClick={() =>
                table.getColumn("level")?.setFilterValue(
                  selectedLevel === levelStr ? "" : levelStr
                )
              }
              className="cursor-pointer"
            >
              Poziom {level}
            </Badge>
          );
        })}

        {/* Reset filtrów */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
