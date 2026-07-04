import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, ImagePlus, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { queryKeys, toursClient } from "@/api";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { ServerTable } from "@/components/admin/ServerTable";
import { FeaturedBadge, StatusBadge } from "@/components/admin/Badges";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { formatMoney } from "@/lib/utils";
import type { MediaAsset, TourCategory, TourDetails, TourSummary } from "@/types/api";

type TourForm = {
  id?: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: string;
  duration: string;
  durationText: string;
  durationUnit: string;
  categoryId: string;
  featuredImagePath: string;
  isActive: boolean;
  isFeatured: boolean;
  isPackage: boolean;
  sortOrder: string;
};

const blankTour: TourForm = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  duration: "1",
  durationText: "",
  durationUnit: "days",
  categoryId: "",
  featuredImagePath: "",
  isActive: true,
  isFeatured: false,
  isPackage: false,
  sortOrder: "0",
};

function tourPayload(form: TourForm) {
  return {
    ...(form.id ? { id: form.id } : {}),
    price: form.price ? Number(form.price) : null,
    duration: Number(form.duration || 1),
    durationText: form.durationText || null,
    isPackage: form.isPackage,
    categoryId: Number(form.categoryId),
    featuredImagePath: form.featuredImagePath || null,
    isActive: form.isActive,
    isFeatured: form.isFeatured,
    sortOrder: Number(form.sortOrder || 0),
    translations: [
      {
        language: "en",
        title: form.title,
        slug: form.slug || null,
        shortDescription: form.shortDescription,
        description: form.description,
        metaDescription: form.shortDescription.slice(0, 200) || null,
        metaKeywords: null,
        durationUnit: form.durationUnit || null,
        activityHighlights: null,
      },
    ],
  };
}

function TourEditor({ open, tour, onClose }: { open: boolean; tour?: TourDetails | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<TourForm>(blankTour);

  useEffect(() => {
    if (!open) return;
    setForm(
      tour
        ? {
            id: tour.id,
            title: tour.title,
            slug: tour.slug ?? "",
            shortDescription: tour.shortDescription,
            description: tour.description,
            price: tour.price?.toString() ?? "",
            duration: tour.duration.toString(),
            durationText: tour.durationText ?? "",
            durationUnit: tour.durationUnit ?? "days",
            categoryId: tour.categoryId.toString(),
            featuredImagePath: tour.featuredImagePath ?? "",
            isActive: tour.isActive,
            isFeatured: tour.isFeatured,
            isPackage: tour.isPackage,
            sortOrder: tour.sortOrder.toString(),
          }
        : blankTour
    );
  }, [open, tour]);

  const categories = useQuery({
    queryKey: queryKeys.tours.categorySelect,
    queryFn: () => toursClient.listCategories({ pageNumber: 1, pageSize: 100, language: "en" }),
  });

  const save = useMutation({
    mutationFn: () => (form.id ? toursClient.updateTour(form.id, tourPayload(form)) : toursClient.createTour(tourPayload(form))),
    onSuccess: () => {
      toast.success(form.id ? "Tour updated." : "Tour created.");
      void queryClient.invalidateQueries();
      onClose();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Tour save failed."),
  });

  const set = <K extends keyof TourForm>(key: K, value: TourForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const onUpload = (asset: MediaAsset) => set("featuredImagePath", asset.imagePath);

  return (
    <Modal
      open={open}
      wide
      title={form.id ? "Edit tour" : "Create tour"}
      description="English content is created first; translations can be refined from the API translation endpoints later."
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="button" disabled={save.isPending || !form.title || !form.description || !form.categoryId} onClick={() => save.mutate()}>
            {save.isPending ? "Saving" : "Save tour"}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Title"><Input value={form.title} onChange={(event) => set("title", event.target.value)} /></Field>
        <Field label="Slug"><Input value={form.slug} onChange={(event) => set("slug", event.target.value)} /></Field>
        <Field label="Category"><Select value={form.categoryId} onChange={(event) => set("categoryId", event.target.value)}><option value="">Select category</option>{categories.data?.items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field>
        <Field label="Price"><Input value={form.price} type="number" min="0" onChange={(event) => set("price", event.target.value)} /></Field>
        <Field label="Duration"><Input value={form.duration} type="number" min="1" onChange={(event) => set("duration", event.target.value)} /></Field>
        <Field label="Duration text"><Input value={form.durationText} onChange={(event) => set("durationText", event.target.value)} /></Field>
        <Field label="Duration unit"><Input value={form.durationUnit} onChange={(event) => set("durationUnit", event.target.value)} /></Field>
        <Field label="Sort order"><Input value={form.sortOrder} type="number" onChange={(event) => set("sortOrder", event.target.value)} /></Field>
        <Field label="Short description"><Textarea value={form.shortDescription} onChange={(event) => set("shortDescription", event.target.value)} /></Field>
        <Field label="Description"><Textarea value={form.description} onChange={(event) => set("description", event.target.value)} /></Field>
        <div className="space-y-2 lg:col-span-2">
          <Field label="Featured image path"><Input value={form.featuredImagePath} onChange={(event) => set("featuredImagePath", event.target.value)} /></Field>
          <MediaUploader folderName="tours" onUploaded={onUpload} buttonLabel="Upload featured image" />
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(event) => set("isActive", event.target.checked)} /> Active</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(event) => set("isFeatured", event.target.checked)} /> Featured</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPackage} onChange={(event) => set("isPackage", event.target.checked)} /> Package</label>
      </div>
    </Modal>
  );
}

function CategoryEditor({ open, category, onClose }: { open: boolean; category?: TourCategory | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [iconClass, setIconClass] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!open) return;
    setName(category?.name ?? "");
    setSlug(category?.slug ?? "");
    setDescription(category?.description ?? "");
    setIconClass(category?.iconClass ?? "");
    setSortOrder(category?.sortOrder.toString() ?? "0");
    setIsActive(category?.isActive ?? true);
  }, [category, open]);

  const payload = { iconClass: iconClass || null, isActive, sortOrder: Number(sortOrder || 0), translations: [{ language: "en", name, description: description || null, slug: slug || null }] };
  const save = useMutation({
    mutationFn: () => category ? toursClient.updateCategory(category.id, { id: category.id, ...payload }) : toursClient.createCategory(payload),
    onSuccess: () => { toast.success("Tour category saved."); void queryClient.invalidateQueries(); onClose(); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Category save failed."),
  });

  return (
    <Modal open={open} title={category ? "Edit tour category" : "Create tour category"} onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button disabled={!name || save.isPending} onClick={() => save.mutate()}>Save category</Button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name"><Input value={name} onChange={(event) => setName(event.target.value)} /></Field>
        <Field label="Slug"><Input value={slug} onChange={(event) => setSlug(event.target.value)} /></Field>
        <Field label="Icon class"><Input value={iconClass} onChange={(event) => setIconClass(event.target.value)} /></Field>
        <Field label="Sort order"><Input type="number" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} /></Field>
        <div className="sm:col-span-2"><Field label="Description"><Textarea value={description} onChange={(event) => setDescription(event.target.value)} /></Field></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} /> Active</label>
      </div>
    </Modal>
  );
}

export function ToursPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"tours" | "categories">("tours");
  const [editingTourId, setEditingTourId] = useState<number | null>(null);
  const [creatingTour, setCreatingTour] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TourCategory | null>(null);
  const [creatingCategory, setCreatingCategory] = useState(false);

  const tourDetails = useQuery({ queryKey: queryKeys.tours.details(editingTourId), queryFn: () => toursClient.getTour(editingTourId!, "en"), enabled: Boolean(editingTourId) });
  const deleteTour = useMutation({ mutationFn: (id: number) => toursClient.deleteTour(id), onSuccess: () => { toast.success("Tour deleted."); void queryClient.invalidateQueries(); }, onError: (error) => toast.error(error instanceof Error ? error.message : "Delete failed.") });
  const deleteCategory = useMutation({ mutationFn: (id: number) => toursClient.deleteCategory(id), onSuccess: () => { toast.success("Category deleted."); void queryClient.invalidateQueries(); }, onError: (error) => toast.error(error instanceof Error ? error.message : "Delete failed.") });

  const tourColumns = useMemo<ColumnDef<TourSummary>[]>(() => [
    { accessorKey: "title", header: "Tour", cell: ({ row }) => <div><p className="font-medium">{row.original.title}</p><p className="text-xs text-muted-foreground">{row.original.categoryName ?? "No category"}</p></div> },
    { accessorKey: "price", header: "Price", cell: ({ row }) => formatMoney(row.original.price) },
    { accessorKey: "duration", header: "Duration", cell: ({ row }) => row.original.durationText || `${row.original.duration}` },
    { accessorKey: "isActive", header: "Status", cell: ({ row }) => <StatusBadge active={row.original.isActive} /> },
    { accessorKey: "isFeatured", header: "Feature", cell: ({ row }) => <FeaturedBadge active={row.original.isFeatured} /> },
    { id: "actions", header: "Actions", cell: ({ row }) => <div className="flex gap-2"><Button variant="secondary" size="sm" onClick={() => setEditingTourId(row.original.id)}><Edit className="h-4 w-4" />Edit</Button><Button variant="destructive" size="sm" onClick={() => deleteTour.mutate(row.original.id)}><Trash2 className="h-4 w-4" />Delete</Button></div> },
  ], [deleteTour]);

  const categoryColumns = useMemo<ColumnDef<TourCategory>[]>(() => [
    { accessorKey: "name", header: "Category", cell: ({ row }) => <div><p className="font-medium">{row.original.name}</p><p className="text-xs text-muted-foreground">{row.original.slug ?? "No slug"}</p></div> },
    { accessorKey: "sortOrder", header: "Sort" },
    { accessorKey: "isActive", header: "Status", cell: ({ row }) => <StatusBadge active={row.original.isActive} /> },
    { id: "actions", header: "Actions", cell: ({ row }) => <div className="flex gap-2"><Button variant="secondary" size="sm" onClick={() => setEditingCategory(row.original)}><Edit className="h-4 w-4" />Edit</Button><Button variant="destructive" size="sm" onClick={() => deleteCategory.mutate(row.original.id)}><Trash2 className="h-4 w-4" />Delete</Button></div> },
  ], [deleteCategory]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="font-display text-4xl font-semibold">Tours</h1><p className="text-sm text-muted-foreground">Create clear tour records, categories, and featured content.</p></div>
        <div className="flex gap-2"><Button variant={tab === "tours" ? "default" : "secondary"} onClick={() => setTab("tours")}>Tours</Button><Button variant={tab === "categories" ? "default" : "secondary"} onClick={() => setTab("categories")}>Categories</Button></div>
      </div>
      {tab === "tours" ? <ServerTable<TourSummary> title="Tour catalog" queryKey={queryKeys.tours.lists} queryFn={toursClient.listTours} columns={tourColumns} defaultQuery={{ language: "en" }} filters={[{ key: "isActive", label: "Any status", options: [{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }] }, { key: "isFeatured", label: "Any feature", options: [{ value: "true", label: "Featured" }, { value: "false", label: "Standard" }] }]} toolbar={<Button size="sm" onClick={() => setCreatingTour(true)}><Plus className="h-4 w-4" />New tour</Button>} /> : null}
      {tab === "categories" ? <ServerTable<TourCategory> title="Tour categories" queryKey={queryKeys.tours.categories()} queryFn={toursClient.listCategories} columns={categoryColumns} defaultQuery={{ language: "en" }} toolbar={<Button size="sm" onClick={() => setCreatingCategory(true)}><ImagePlus className="h-4 w-4" />New category</Button>} /> : null}
      <TourEditor open={creatingTour || Boolean(editingTourId)} tour={tourDetails.data ?? null} onClose={() => { setCreatingTour(false); setEditingTourId(null); }} />
      <CategoryEditor open={creatingCategory || Boolean(editingCategory)} category={editingCategory} onClose={() => { setCreatingCategory(false); setEditingCategory(null); }} />
    </div>
  );
}