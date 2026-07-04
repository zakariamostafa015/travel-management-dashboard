import { useQuery } from "@tanstack/react-query";
import { Activity, BookOpen, CalendarCheck, Languages, Plane, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { blogClient, inboxClient, operationsClient, queryKeys, toursClient, usersClient } from "@/api";
import { formatDate } from "@/lib/utils";
import type { BlogPostSummary, BookingRequest, ContactInquiry, PagedResult, TourSummary, User } from "@/types/api";

function useCount<T>(key: string, queryFn: (query: Record<string, unknown>) => Promise<PagedResult<T>>, query: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: queryKeys.dashboard.count(key, query),
    queryFn: () => queryFn({ pageNumber: 1, pageSize: 1, ...query }),
  });
}

function Metric({ label, value, icon: Icon, tone = "cream" }: { label: string; value?: number; icon: typeof Plane; tone?: "cream" | "dark" }) {
  return (
    <Card className={tone === "dark" ? "border-[#252320] bg-[#181715] text-[#faf9f5]" : undefined}>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className={tone === "dark" ? "text-sm text-[#a09d96]" : "text-sm text-muted-foreground"}>{label}</p>
          <p className="mt-2 text-3xl font-semibold">{value ?? "-"}</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </span>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const tours = useCount<TourSummary>("tours", toursClient.listTours);
  const blog = useCount<BlogPostSummary>("blog", blogClient.listPosts);
  const bookings = useCount<BookingRequest>("bookings", inboxClient.listBookings);
  const inquiries = useCount<ContactInquiry>("inquiries", inboxClient.listInquiries);
  const users = useCount<User>("users", usersClient.listUsers);
  const languages = useCount("languages", operationsClient.listLanguages);

  const recentBookings = useQuery({
    queryKey: queryKeys.dashboard.recentBookings,
    queryFn: () => inboxClient.listBookings({ pageNumber: 1, pageSize: 5, sortBy: "CreatedDate", sortDirection: 1 }),
  });

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-[#181715] p-6 text-[#faf9f5]">
        <p className="text-sm font-medium text-primary">Admin dashboard</p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight">Keep tours, content, and requests moving clearly.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#d7d1c8]">
          This workspace is wired directly to the REST API. Each metric below validates a core endpoint and gives admins a quick health read.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Metric label="Tours" value={tours.data?.totalCount} icon={Plane} />
        <Metric label="Blog posts" value={blog.data?.totalCount} icon={BookOpen} />
        <Metric label="Bookings" value={bookings.data?.totalCount} icon={CalendarCheck} tone="dark" />
        <Metric label="Inquiries" value={inquiries.data?.totalCount} icon={Activity} />
        <Metric label="Users" value={users.data?.totalCount} icon={Users} />
        <Metric label="Languages" value={languages.data?.totalCount} icon={Languages} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent booking requests</CardTitle>
          <CardDescription>Newest customer requests from the API.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {(recentBookings.data?.items ?? []).map((booking) => (
              <div key={booking.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{booking.name}</p>
                  <p className="text-sm text-muted-foreground">{booking.tourTitle ?? `Tour #${booking.tourId}`} · {booking.numberOfTravelers} travelers</p>
                </div>
                <p className="text-sm text-muted-foreground">{formatDate(booking.createdDate)}</p>
              </div>
            ))}
            {!recentBookings.data?.items.length ? <div className="px-5 py-8 text-sm text-muted-foreground">No recent bookings found.</div> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}