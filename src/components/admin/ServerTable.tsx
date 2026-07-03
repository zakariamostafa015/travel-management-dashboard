import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, RefreshCw, Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { api, ApiError } from "@/lib/api";
import type { PagedResult } from "@/types/api";

export type FilterConfig = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
};

export function ServerTable<T extends object>({
  title,
  description,
  endpoint,
  queryKey,
  columns,
  filters = [],
  defaultQuery = {},
  toolbar,
}: {
  title: string;
  description?: string;
  endpoint: string;
  queryKey: string;
  columns: ColumnDef<T>[];
  filters?: FilterConfig[];
  defaultQuery?: Record<string, unknown>;
  toolbar?: ReactNode;
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const sort = sorting[0];
  const query = useMemo(
    () => ({
      ...defaultQuery,
      ...filterValues,
      pageNumber,
      pageSize,
      searchTerm,
      sortBy: sort?.id,
      sortDirection: sort ? (sort.desc ? 1 : 0) : undefined,
    }),
    [defaultQuery, filterValues, pageNumber, pageSize, searchTerm, sort]
  );

  const result = useQuery({
    queryKey: [queryKey, query],
    queryFn: () => api.get<PagedResult<T>>(endpoint, query),
  });

  const table = useReactTable({
    data: result.data?.items ?? [],
    columns,
    state: { sorting },
    manualSorting: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  });

  const error = result.error instanceof ApiError ? result.error : null;

  return (
    <section className="rounded-lg border border-border bg-background shadow-soft">
      <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {toolbar}
          <Button type="button" variant="secondary" size="sm" onClick={() => void result.refetch()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center">
        <div className="relative min-w-64 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => {
              setPageNumber(1);
              setSearchTerm(event.target.value);
            }}
            placeholder="Search records"
            className="pl-9"
          />
        </div>
        {filters.map((filter) => (
          <Select
            key={filter.key}
            aria-label={filter.label}
            value={filterValues[filter.key] ?? ""}
            onChange={(event) => {
              setPageNumber(1);
              setFilterValues((current) => ({ ...current, [filter.key]: event.target.value }));
            }}
            className="w-full lg:w-48"
          >
            <option value="">{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ))}
      </div>

      {error ? (
        <div className="p-4 text-sm text-destructive">
          {error.message} {error.traceId ? <span className="text-muted-foreground">Trace: {error.traceId}</span> : null}
        </div>
      ) : null}

      <div className="admin-scrollbar overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-secondary/70 text-left text-xs font-semibold uppercase text-muted-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3">
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 hover:text-foreground"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : null}
                        {header.column.getIsSorted() === "desc" ? <ArrowDown className="h-3.5 w-3.5" /> : null}
                        {!header.column.getIsSorted() ? <ChevronsUpDown className="h-3.5 w-3.5" /> : null}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {result.isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-t border-border">
                  <td colSpan={columns.length} className="px-4 py-4">
                    <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                  </td>
                </tr>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-border hover:bg-secondary/45">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="border-t border-border">
                <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Page {result.data?.pageNumber ?? pageNumber} of {result.data?.totalPages || 1} · {result.data?.totalCount ?? 0} records
        </p>
        <div className="flex items-center gap-2">
          <Select value={String(pageSize)} onChange={(event) => setPageSize(Number(event.target.value))} className="w-24">
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} rows
              </option>
            ))}
          </Select>
          <Button type="button" variant="secondary" size="sm" disabled={!result.data?.hasPreviousPage} onClick={() => setPageNumber((value) => Math.max(1, value - 1))}>
            Previous
          </Button>
          <Button type="button" variant="secondary" size="sm" disabled={!result.data?.hasNextPage} onClick={() => setPageNumber((value) => value + 1)}>
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}