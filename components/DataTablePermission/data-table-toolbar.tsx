"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/DataTableCommons/data-table-view-options";
import { RoleDialog } from "./create-role-dialog";

interface DataTableSimpleToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableSimpleToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      {/* LEFT SIDE: Filters */}
      <div className="flex items-center space-x-2">
        {/* Filter by Permission Tag */}
        <Input
          placeholder="Filtruj uprawnienie (tag)..."
          value={(table.getColumn("tag")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("tag")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[200px] lg:w-[300px]"
        />

        {/* Reset Filters */}
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

      {/* RIGHT SIDE: Create Role + Table View Options */}
      <div className="flex items-center space-x-2">
        <RoleDialog />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
