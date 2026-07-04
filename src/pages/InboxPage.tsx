import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { inboxClient, queryKeys } from "@/api";
import { BookingBadge, InquiryBadge } from "@/components/admin/Badges";
import { ServerTable } from "@/components/admin/ServerTable";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { bookingStatusLabels, inquiryStatusLabels } from "@/lib/labels";
import { formatDate, formatMoney } from "@/lib/utils";
import type { BookingRequest, BookingStatus, ContactInquiry, InquiryStatus } from "@/types/api";

function InquiryStatusEditor({ inquiry, onClose }: { inquiry: ContactInquiry | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<InquiryStatus>(inquiry?.status ?? 0);
  const [adminNotes, setAdminNotes] = useState(inquiry?.adminNotes ?? "");
  useEffect(() => { setStatus(inquiry?.status ?? 0); setAdminNotes(inquiry?.adminNotes ?? ""); }, [inquiry]);
  const save = useMutation({ mutationFn: () => inquiry ? inboxClient.updateInquiryStatus(inquiry.id, { id: inquiry.id, status, adminNotes: adminNotes || null }).then(() => undefined) : Promise.resolve(), onSuccess: () => { toast.success("Inquiry updated."); void queryClient.invalidateQueries(); onClose(); }, onError: (error) => toast.error(error instanceof Error ? error.message : "Update failed.") });
  return <Modal open={Boolean(inquiry)} title="Update inquiry" onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button disabled={save.isPending} onClick={() => save.mutate()}>Save status</Button></>}><div className="space-y-4"><div className="rounded-md bg-secondary p-4 text-sm"><p className="font-medium">{inquiry?.subject}</p><p className="mt-2 text-muted-foreground">{inquiry?.message}</p></div><Field label="Status"><Select value={status} onChange={(event) => setStatus(Number(event.target.value) as InquiryStatus)}>{Object.entries(inquiryStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></Field><Field label="Admin notes"><Textarea value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} /></Field></div></Modal>;
}

function BookingStatusEditor({ booking, onClose }: { booking: BookingRequest | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<BookingStatus>(booking?.status ?? 0);
  const [adminNotes, setAdminNotes] = useState(booking?.adminNotes ?? "");
  useEffect(() => { setStatus(booking?.status ?? 0); setAdminNotes(booking?.adminNotes ?? ""); }, [booking]);
  const save = useMutation({ mutationFn: () => booking ? inboxClient.updateBookingStatus(booking.id, { id: booking.id, status, adminNotes: adminNotes || null }).then(() => undefined) : Promise.resolve(), onSuccess: () => { toast.success("Booking updated."); void queryClient.invalidateQueries(); onClose(); }, onError: (error) => toast.error(error instanceof Error ? error.message : "Update failed.") });
  return <Modal open={Boolean(booking)} title="Update booking" onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button disabled={save.isPending} onClick={() => save.mutate()}>Save status</Button></>}><div className="space-y-4"><div className="rounded-md bg-secondary p-4 text-sm"><p className="font-medium">{booking?.name} · {booking?.tourTitle ?? `Tour #${booking?.tourId}`}</p><p className="mt-2 text-muted-foreground">{booking?.specialRequests || "No special requests."}</p></div><Field label="Status"><Select value={status} onChange={(event) => setStatus(Number(event.target.value) as BookingStatus)}>{Object.entries(bookingStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></Field><Field label="Admin notes"><Textarea value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} /></Field></div></Modal>;
}

export function InboxPage() {
  const [tab, setTab] = useState<"bookings" | "inquiries">("bookings");
  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [inquiry, setInquiry] = useState<ContactInquiry | null>(null);

  const bookingColumns = useMemo<ColumnDef<BookingRequest>[]>(() => [
    { accessorKey: "name", header: "Customer", cell: ({ row }) => <div><p className="font-medium">{row.original.name}</p><p className="text-xs text-muted-foreground">{row.original.email} · {row.original.phone}</p></div> },
    { accessorKey: "tourTitle", header: "Tour", cell: ({ row }) => row.original.tourTitle ?? `Tour #${row.original.tourId}` },
    { accessorKey: "preferredTravelDate", header: "Travel date", cell: ({ row }) => formatDate(row.original.preferredTravelDate) },
    { accessorKey: "estimatedTotal", header: "Estimate", cell: ({ row }) => formatMoney(row.original.estimatedTotal) },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <BookingBadge status={row.original.status} /> },
    { id: "actions", header: "Actions", cell: ({ row }) => <Button variant="secondary" size="sm" onClick={() => setBooking(row.original)}><Edit className="h-4 w-4" />Status</Button> },
  ], []);

  const inquiryColumns = useMemo<ColumnDef<ContactInquiry>[]>(() => [
    { accessorKey: "subject", header: "Inquiry", cell: ({ row }) => <div><p className="font-medium">{row.original.subject}</p><p className="text-xs text-muted-foreground">{row.original.name} · {row.original.email}</p></div> },
    { accessorKey: "createdDate", header: "Created", cell: ({ row }) => formatDate(row.original.createdDate) },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <InquiryBadge status={row.original.status} /> },
    { id: "actions", header: "Actions", cell: ({ row }) => <Button variant="secondary" size="sm" onClick={() => setInquiry(row.original)}><Edit className="h-4 w-4" />Status</Button> },
  ], []);

  return <div className="space-y-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="font-display text-4xl font-semibold">Inbox</h1><p className="text-sm text-muted-foreground">Track bookings and contact inquiries from customers.</p></div><div className="flex gap-2"><Button variant={tab === "bookings" ? "default" : "secondary"} onClick={() => setTab("bookings")}>Bookings</Button><Button variant={tab === "inquiries" ? "default" : "secondary"} onClick={() => setTab("inquiries")}>Inquiries</Button></div></div>{tab === "bookings" ? <ServerTable<BookingRequest> title="Booking requests" queryKey={queryKeys.inbox.bookings()} queryFn={inboxClient.listBookings} columns={bookingColumns} filters={[{ key: "status", label: "Any status", options: Object.entries(bookingStatusLabels).map(([value, label]) => ({ value, label })) }]} /> : null}{tab === "inquiries" ? <ServerTable<ContactInquiry> title="Contact inquiries" queryKey={queryKeys.inbox.inquiries()} queryFn={inboxClient.listInquiries} columns={inquiryColumns} filters={[{ key: "status", label: "Any status", options: Object.entries(inquiryStatusLabels).map(([value, label]) => ({ value, label })) }]} /> : null}<BookingStatusEditor booking={booking} onClose={() => setBooking(null)} /><InquiryStatusEditor inquiry={inquiry} onClose={() => setInquiry(null)} /></div>;
}