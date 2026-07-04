import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, KeyRound, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { queryKeys, usersClient } from "@/api";
import { RoleBadge, StatusBadge } from "@/components/admin/Badges";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { ServerTable } from "@/components/admin/ServerTable";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { roleLabels } from "@/lib/labels";
import { formatDate } from "@/lib/utils";
import type { MediaAsset, User, UserRole } from "@/types/api";

type UserForm = { id?: number; username: string; email: string; password: string; firstName: string; lastName: string; bio: string; profileImagePath: string; role: UserRole; isActive: boolean; emailConfirmed: boolean };
const blank: UserForm = { username: "", email: "", password: "", firstName: "", lastName: "", bio: "", profileImagePath: "", role: 2, isActive: true, emailConfirmed: false };

function UserEditor({ open, user, onClose }: { open: boolean; user?: User | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<UserForm>(blank);
  useEffect(() => { if (!open) return; setForm(user ? { id: user.id, username: user.username, email: user.email, password: "", firstName: user.firstName ?? "", lastName: user.lastName ?? "", bio: user.bio ?? "", profileImagePath: user.profileImagePath ?? "", role: user.role, isActive: user.isActive, emailConfirmed: user.emailConfirmed } : blank); }, [open, user]);
  const save = useMutation({
    mutationFn: () => form.id ? usersClient.updateUser(form.id, { id: form.id, username: form.username, email: form.email, firstName: form.firstName || null, lastName: form.lastName || null, bio: form.bio || null, profileImagePath: form.profileImagePath || null, role: form.role, isActive: form.isActive, emailConfirmed: form.emailConfirmed }) : usersClient.createUser({ username: form.username, email: form.email, password: form.password, firstName: form.firstName || null, lastName: form.lastName || null, role: form.role, isActive: form.isActive }),
    onSuccess: () => { toast.success("User saved."); void queryClient.invalidateQueries(); onClose(); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "User save failed."),
  });
  const uploaded = (asset: MediaAsset) => setForm((current) => ({ ...current, profileImagePath: asset.imagePath }));
  return <Modal open={open} wide title={form.id ? "Edit user" : "Create user"} onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button disabled={!form.username || !form.email || (!form.id && !form.password) || save.isPending} onClick={() => save.mutate()}>Save user</Button></>}><div className="grid gap-4 sm:grid-cols-2"><Field label="Username"><Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></Field><Field label="Email"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>{!form.id ? <Field label="Password"><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field> : null}<Field label="Role"><Select value={form.role} onChange={(e) => setForm({ ...form, role: Number(e.target.value) as UserRole })}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></Field><Field label="First name"><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></Field><Field label="Last name"><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field><div className="sm:col-span-2"><Field label="Profile image"><Input value={form.profileImagePath} onChange={(e) => setForm({ ...form, profileImagePath: e.target.value })} /></Field><div className="mt-2"><MediaUploader folderName="users" onUploaded={uploaded} buttonLabel="Upload profile image" /></div></div><div className="sm:col-span-2"><Field label="Bio"><Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></Field></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>{form.id ? <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.emailConfirmed} onChange={(e) => setForm({ ...form, emailConfirmed: e.target.checked })} /> Email confirmed</label> : null}</div></Modal>;
}

function PasswordReset({ user, onClose }: { user: User | null; onClose: () => void }) {
  const [password, setPassword] = useState("");
  const mutation = useMutation({ mutationFn: () => user ? usersClient.resetPassword(user.id, { userId: user.id, newPassword: password }) : Promise.resolve(), onSuccess: () => { toast.success("Password reset."); setPassword(""); onClose(); }, onError: (error) => toast.error(error instanceof Error ? error.message : "Password reset failed.") });
  return <Modal open={Boolean(user)} title="Reset password" onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button disabled={password.length < 8 || mutation.isPending} onClick={() => mutation.mutate()}>Reset password</Button></>}><Field label={`New password for ${user?.username ?? "user"}`}><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field></Modal>;
}

export function UsersPage() {
  const queryClient = useQueryClient();
  const [newUser, setNewUser] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [resetting, setResetting] = useState<User | null>(null);
  const remove = useMutation({ mutationFn: (id: number) => usersClient.deleteUser(id), onSuccess: () => { toast.success("User deleted."); void queryClient.invalidateQueries(); }, onError: (error) => toast.error(error instanceof Error ? error.message : "Delete failed.") });
  const reactivate = useMutation({ mutationFn: (id: number) => usersClient.reactivateUser(id), onSuccess: () => { toast.success("User reactivated."); void queryClient.invalidateQueries(); } });
  const columns = useMemo<ColumnDef<User>[]>(() => [
    { accessorKey: "username", header: "User", cell: ({ row }) => <div><p className="font-medium">{row.original.username}</p><p className="text-xs text-muted-foreground">{row.original.email}</p></div> },
    { accessorKey: "role", header: "Role", cell: ({ row }) => <RoleBadge role={row.original.role} /> },
    { accessorKey: "isActive", header: "Status", cell: ({ row }) => <StatusBadge active={row.original.isActive} /> },
    { accessorKey: "createdDate", header: "Created", cell: ({ row }) => formatDate(row.original.createdDate) },
    { id: "actions", header: "Actions", cell: ({ row }) => <div className="flex flex-wrap gap-2"><Button size="sm" variant="secondary" onClick={() => setEditing(row.original)}><Edit className="h-4 w-4" />Edit</Button><Button size="sm" variant="secondary" onClick={() => setResetting(row.original)}><KeyRound className="h-4 w-4" />Password</Button>{!row.original.isActive ? <Button size="sm" variant="secondary" onClick={() => reactivate.mutate(row.original.id)}><RotateCcw className="h-4 w-4" />Reactivate</Button> : null}<Button size="sm" variant="destructive" onClick={() => remove.mutate(row.original.id)}><Trash2 className="h-4 w-4" />Delete</Button></div> },
  ], [reactivate, remove]);
  return <div className="space-y-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="font-display text-4xl font-semibold">Users</h1><p className="text-sm text-muted-foreground">Manage admin accounts, roles, and password resets.</p></div></div><ServerTable<User> title="Admin users" queryKey={queryKeys.users.list()} queryFn={usersClient.listUsers} columns={columns} filters={[{ key: "role", label: "Any role", options: Object.entries(roleLabels).map(([value, label]) => ({ value, label })) }, { key: "isActive", label: "Any status", options: [{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }] }]} toolbar={<Button size="sm" onClick={() => setNewUser(true)}><Plus className="h-4 w-4" />New user</Button>} /><UserEditor open={newUser || Boolean(editing)} user={editing} onClose={() => { setNewUser(false); setEditing(null); }} /><PasswordReset user={resetting} onClose={() => setResetting(null)} /></div>;
}