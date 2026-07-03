import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ServerTable } from "@/components/admin/ServerTable";
import { formatDateTime } from "@/lib/utils";
import type { AuditLog } from "@/types/api";

export function AuditPage() {
  const columns = useMemo<ColumnDef<AuditLog>[]>(() => [
    { accessorKey: "createdAtUtc", header: "Time", cell: ({ row }) => formatDateTime(row.original.createdAtUtc) },
    { accessorKey: "httpMethod", header: "Method", cell: ({ row }) => <Badge variant="muted">{row.original.httpMethod}</Badge> },
    { accessorKey: "path", header: "Path", cell: ({ row }) => <div><p className="font-medium">{row.original.path}</p><p className="text-xs text-muted-foreground">{row.original.action ?? row.original.area ?? "API"}</p></div> },
    { accessorKey: "statusCode", header: "Status", cell: ({ row }) => <Badge variant={row.original.succeeded ? "success" : "danger"}>{row.original.statusCode}</Badge> },
    { accessorKey: "username", header: "User", cell: ({ row }) => row.original.username ?? "Anonymous" },
    { accessorKey: "elapsedMilliseconds", header: "Elapsed", cell: ({ row }) => `${row.original.elapsedMilliseconds} ms` },
    { accessorKey: "traceId", header: "Trace", cell: ({ row }) => <span className="font-mono text-xs">{row.original.traceId ?? "-"}</span> },
  ], []);
  return <div className="space-y-5"><div><h1 className="font-display text-4xl font-semibold">Audit</h1><p className="text-sm text-muted-foreground">Review authenticated API activity and request outcomes.</p></div><ServerTable<AuditLog> title="Audit logs" endpoint="/admin/audit-logs" queryKey="audit-logs" columns={columns} filters={[{ key: "succeeded", label: "Any outcome", options: [{ value: "true", label: "Succeeded" }, { value: "false", label: "Failed" }] }, { key: "httpMethod", label: "Any method", options: ["GET", "POST", "PUT", "PATCH", "DELETE"].map((value) => ({ value, label: value })) }]} /></div>;
}