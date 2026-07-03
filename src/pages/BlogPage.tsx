import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FeaturedBadge, StatusBadge } from "@/components/admin/Badges";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { ServerTable } from "@/components/admin/ServerTable";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/auth/AuthProvider";
import { api } from "@/lib/api";
import { formatDate, toDateInputValue } from "@/lib/utils";
import type { BlogCategory, BlogPostDetails, BlogPostSummary, MediaAsset, PagedResult } from "@/types/api";

type BlogForm = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  authorId: string;
  featuredImagePath: string;
  isPublished: boolean;
  isFeatured: boolean;
  isEvent: boolean;
  publishedDate: string;
};

const blankPost: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  categoryId: "",
  authorId: "",
  featuredImagePath: "",
  isPublished: false,
  isFeatured: false,
  isEvent: false,
  publishedDate: "",
};

function postPayload(form: BlogForm) {
  return {
    ...(form.id ? { id: form.id } : {}),
    featuredImagePath: form.featuredImagePath || null,
    categoryId: Number(form.categoryId),
    authorId: Number(form.authorId),
    isPublished: form.isPublished,
    isFeatured: form.isFeatured,
    isEvent: form.isEvent,
    publishedDate: form.publishedDate || null,
    translations: [{ language: "en", title: form.title, excerpt: form.excerpt, content: form.content, slug: form.slug || null, metaDescription: form.excerpt.slice(0, 200) || null, metaKeywords: null }],
  };
}

function BlogPostEditor({ open, post, onClose }: { open: boolean; post?: BlogPostDetails | null; onClose: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<BlogForm>({ ...blankPost, authorId: user?.id.toString() ?? "" });

  useEffect(() => {
    if (!open) return;
    setForm(post ? {
      id: post.id,
      title: post.title,
      slug: post.slug ?? "",
      excerpt: post.excerpt,
      content: post.content,
      categoryId: post.categoryId.toString(),
      authorId: post.authorId.toString(),
      featuredImagePath: post.featuredImagePath ?? "",
      isPublished: post.isPublished,
      isFeatured: post.isFeatured,
      isEvent: post.isEvent,
      publishedDate: toDateInputValue(post.publishedDate),
    } : { ...blankPost, authorId: user?.id.toString() ?? "" });
  }, [open, post, user?.id]);

  const categories = useQuery({ queryKey: ["blog-categories-select"], queryFn: () => api.get<PagedResult<BlogCategory>>("/blog/categories", { pageNumber: 1, pageSize: 100, language: "en" }) });
  const save = useMutation({
    mutationFn: () => form.id ? api.put<BlogPostDetails>(`/admin/blog/${form.id}`, postPayload(form)) : api.post<BlogPostDetails>("/admin/blog", postPayload(form)),
    onSuccess: () => { toast.success(form.id ? "Post updated." : "Post created."); void queryClient.invalidateQueries(); onClose(); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Blog post save failed."),
  });
  const set = <K extends keyof BlogForm>(key: K, value: BlogForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const onUpload = (asset: MediaAsset) => set("featuredImagePath", asset.imagePath);

  return (
    <Modal open={open} wide title={form.id ? "Edit blog post" : "Create blog post"} onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button disabled={!form.title || !form.categoryId || !form.authorId || save.isPending} onClick={() => save.mutate()}>Save post</Button></>}>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Title"><Input value={form.title} onChange={(event) => set("title", event.target.value)} /></Field>
        <Field label="Slug"><Input value={form.slug} onChange={(event) => set("slug", event.target.value)} /></Field>
        <Field label="Category"><Select value={form.categoryId} onChange={(event) => set("categoryId", event.target.value)}><option value="">Select category</option>{categories.data?.items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field>
        <Field label="Author id"><Input value={form.authorId} type="number" min="1" onChange={(event) => set("authorId", event.target.value)} /></Field>
        <Field label="Published date"><Input value={form.publishedDate} type="date" onChange={(event) => set("publishedDate", event.target.value)} /></Field>
        <Field label="Featured image path"><Input value={form.featuredImagePath} onChange={(event) => set("featuredImagePath", event.target.value)} /></Field>
        <div className="lg:col-span-2"><MediaUploader folderName="blog" onUploaded={onUpload} buttonLabel="Upload featured image" /></div>
        <Field label="Excerpt"><Textarea value={form.excerpt} onChange={(event) => set("excerpt", event.target.value)} /></Field>
        <Field label="Content"><Textarea className="min-h-48" value={form.content} onChange={(event) => set("content", event.target.value)} /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={(event) => set("isPublished", event.target.checked)} /> Published</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(event) => set("isFeatured", event.target.checked)} /> Featured</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isEvent} onChange={(event) => set("isEvent", event.target.checked)} /> Event</label>
      </div>
    </Modal>
  );
}

function BlogCategoryEditor({ open, category, onClose }: { open: boolean; category?: BlogCategory | null; onClose: () => void }) {
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
    mutationFn: () => category ? api.put(`/admin/blog/categories/${category.id}`, { id: category.id, ...payload }) : api.post("/admin/blog/categories", payload),
    onSuccess: () => { toast.success("Blog category saved."); void queryClient.invalidateQueries(); onClose(); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Category save failed."),
  });

  return (
    <Modal open={open} title={category ? "Edit blog category" : "Create blog category"} onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button disabled={!name || save.isPending} onClick={() => save.mutate()}>Save category</Button></>}>
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

export function BlogPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"posts" | "categories">("posts");
  const [creatingPost, setCreatingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const postDetails = useQuery({ queryKey: ["blog-post-details", editingPostId], queryFn: () => api.get<BlogPostDetails>(`/blog/${editingPostId}`, { language: "en" }), enabled: Boolean(editingPostId) });
  const deletePost = useMutation({ mutationFn: (id: number) => api.delete(`/admin/blog/${id}`), onSuccess: () => { toast.success("Post deleted."); void queryClient.invalidateQueries(); }, onError: (error) => toast.error(error instanceof Error ? error.message : "Delete failed.") });
  const deleteCategory = useMutation({ mutationFn: (id: number) => api.delete(`/admin/blog/categories/${id}`), onSuccess: () => { toast.success("Category deleted."); void queryClient.invalidateQueries(); }, onError: (error) => toast.error(error instanceof Error ? error.message : "Delete failed.") });

  const postColumns = useMemo<ColumnDef<BlogPostSummary>[]>(() => [
    { accessorKey: "title", header: "Post", cell: ({ row }) => <div><p className="font-medium">{row.original.title}</p><p className="text-xs text-muted-foreground">{row.original.categoryName ?? "No category"}</p></div> },
    { accessorKey: "publishedDate", header: "Published", cell: ({ row }) => formatDate(row.original.publishedDate) },
    { accessorKey: "isPublished", header: "Status", cell: ({ row }) => <StatusBadge active={row.original.isPublished} trueLabel="Published" falseLabel="Draft" /> },
    { accessorKey: "isFeatured", header: "Feature", cell: ({ row }) => <FeaturedBadge active={row.original.isFeatured} /> },
    { accessorKey: "viewCount", header: "Views" },
    { id: "actions", header: "Actions", cell: ({ row }) => <div className="flex gap-2"><Button variant="secondary" size="sm" onClick={() => setEditingPostId(row.original.id)}><Edit className="h-4 w-4" />Edit</Button><Button variant="destructive" size="sm" onClick={() => deletePost.mutate(row.original.id)}><Trash2 className="h-4 w-4" />Delete</Button></div> },
  ], [deletePost]);
  const categoryColumns = useMemo<ColumnDef<BlogCategory>[]>(() => [
    { accessorKey: "name", header: "Category", cell: ({ row }) => <div><p className="font-medium">{row.original.name}</p><p className="text-xs text-muted-foreground">{row.original.slug ?? "No slug"}</p></div> },
    { accessorKey: "sortOrder", header: "Sort" },
    { accessorKey: "isActive", header: "Status", cell: ({ row }) => <StatusBadge active={row.original.isActive} /> },
    { id: "actions", header: "Actions", cell: ({ row }) => <div className="flex gap-2"><Button variant="secondary" size="sm" onClick={() => setEditingCategory(row.original)}><Edit className="h-4 w-4" />Edit</Button><Button variant="destructive" size="sm" onClick={() => deleteCategory.mutate(row.original.id)}><Trash2 className="h-4 w-4" />Delete</Button></div> },
  ], [deleteCategory]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="font-display text-4xl font-semibold">Blog</h1><p className="text-sm text-muted-foreground">Manage stories, events, categories, and publishing state.</p></div><div className="flex gap-2"><Button variant={tab === "posts" ? "default" : "secondary"} onClick={() => setTab("posts")}>Posts</Button><Button variant={tab === "categories" ? "default" : "secondary"} onClick={() => setTab("categories")}>Categories</Button></div></div>
      {tab === "posts" ? <ServerTable<BlogPostSummary> title="Blog posts" endpoint="/blog" queryKey="blog-posts" columns={postColumns} defaultQuery={{ language: "en" }} filters={[{ key: "isPublished", label: "Any status", options: [{ value: "true", label: "Published" }, { value: "false", label: "Draft" }] }, { key: "isEvent", label: "Any type", options: [{ value: "true", label: "Events" }, { value: "false", label: "Articles" }] }]} toolbar={<Button size="sm" onClick={() => setCreatingPost(true)}><Plus className="h-4 w-4" />New post</Button>} /> : null}
      {tab === "categories" ? <ServerTable<BlogCategory> title="Blog categories" endpoint="/blog/categories" queryKey="blog-categories" columns={categoryColumns} defaultQuery={{ language: "en" }} toolbar={<Button size="sm" onClick={() => setCreatingCategory(true)}><Plus className="h-4 w-4" />New category</Button>} /> : null}
      <BlogPostEditor open={creatingPost || Boolean(editingPostId)} post={postDetails.data ?? null} onClose={() => { setCreatingPost(false); setEditingPostId(null); }} />
      <BlogCategoryEditor open={creatingCategory || Boolean(editingCategory)} category={editingCategory} onClose={() => { setCreatingCategory(false); setEditingCategory(null); }} />
    </div>
  );
}