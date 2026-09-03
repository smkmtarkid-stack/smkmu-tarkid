"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";

export interface ColumnDef {
  key: string;
  label: string;
  render?: (value: string, row: Record<string, string>) => React.ReactNode;
}

interface DataTableProps {
  columns: ColumnDef[];
  data: Record<string, string>[];
  onEdit?: (row: Record<string, string>) => void;
  onDelete?: (row: Record<string, string>) => void;
  searchableKey?: string;
  pageSize?: number;
}

export function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  searchableKey,
  pageSize = 10,
}: DataTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search || !searchableKey) return data;
    return data.filter((row) =>
      String(row[searchableKey] || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search, searchableKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      {searchableKey && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari data..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 h-10 rounded-xl bg-card border-border/60 shadow-sm focus-visible:ring-emerald-500"
            />
          </div>
          {filtered.length > 0 && (
            <div className="text-xs font-medium text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg border border-border/40 hidden sm:block">
              Total {filtered.length} Data
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80 border-b border-border/60">
              <TableHead className="w-14 text-center font-semibold text-xs uppercase tracking-wider text-muted-foreground">#</TableHead>
              {columns.map((col) => (
                <TableHead key={col.key} className="font-semibold text-xs uppercase tracking-wider text-muted-foreground py-3.5">{col.label}</TableHead>
              ))}
              {(onEdit || onDelete) && (
                <TableHead className="text-right w-28 font-semibold text-xs uppercase tracking-wider text-muted-foreground py-3.5 pr-6">Aksi</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 2}
                  className="h-48 text-center"
                >
                  <div className="flex flex-col items-center justify-center p-6 text-muted-foreground space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50 shadow-inner">
                      <Search className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-base text-foreground">Belum ada data tersedia</p>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        Data belum diinput atau tidak ditemukan dengan kata kunci pencarian tersebut.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row, index) => (
                <TableRow key={row.id || index} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-colors border-b border-border/40">
                  <TableCell className="text-center font-mono text-xs text-muted-foreground">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.key} className="py-3.5 text-sm">
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] || "-")}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell className="text-right space-x-1.5 pr-6">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(row)}
                          className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-colors"
                          title="Edit Data"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(row)}
                          className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>
            Menampilkan <strong className="text-foreground">{(page - 1) * pageSize + 1}</strong> - <strong className="text-foreground">{Math.min(page * pageSize, filtered.length)}</strong> dari <strong className="text-foreground">{filtered.length}</strong> data
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 font-medium text-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
