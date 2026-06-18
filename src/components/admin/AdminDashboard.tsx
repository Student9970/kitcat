"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Images,
  Plus,
  LogOut,
  Lock,
  Loader2,
} from "lucide-react";

import { api, auth, type AdminPost } from "@/lib/admin/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { PostsTable } from "./PostsTable";
import { PostEditor } from "./PostEditor";
import { MediaLibrary } from "./MediaLibrary";

type View = "posts" | "media" | "editor";

function LoginScreen({ onAuthed }: { onAuthed: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const ok = await api.login(password);
      if (ok) {
        auth.set(password);
        onAuthed();
      } else {
        setError("Incorrect password.");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-default bg-card p-8 shadow-sm"
      >
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <Lock className="size-6" />
          </span>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Enter your password to continue.</p>
        </div>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-default bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-brand-500"
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          Sign in
        </button>
        <p className="mt-4 text-center text-xs text-muted">
          Set <code className="rounded bg-[var(--background)] px-1">ADMIN_PASSWORD</code> in your{" "}
          <code className="rounded bg-[var(--background)] px-1">.env.local</code> file.
        </p>
      </form>
    </div>
  );
}

export function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [view, setView] = useState<View>("posts");
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [editing, setEditing] = useState<AdminPost | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [postList, taxonomy] = await Promise.all([api.listPosts(), api.taxonomy()]);
      setPosts(postList);
      setCategories(taxonomy.categories);
      setTags(taxonomy.tags);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Validate any stored password on mount.
    async function check() {
      if (auth.get()) {
        try {
          await api.listPosts();
          setAuthed(true);
        } catch {
          auth.clear();
        }
      }
      setChecking(false);
    }
    check();
  }, []);

  useEffect(() => {
    // Load posts + taxonomy once the user is authenticated.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (authed) load();
  }, [authed, load]);

  if (checking) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted" />
      </div>
    );
  }

  if (!authed) {
    return <LoginScreen onAuthed={() => setAuthed(true)} />;
  }

  function openNew() {
    setEditing(null);
    setView("editor");
  }

  function openEdit(post: AdminPost) {
    setEditing(post);
    setView("editor");
  }

  function afterSave() {
    setView("posts");
    setEditing(null);
    load();
  }

  const navItems: { id: View; label: string; icon: typeof FileText }[] = [
    { id: "posts", label: "Posts", icon: FileText },
    { id: "media", label: "Media", icon: Images },
  ];

  return (
    <div className="flex min-h-dvh">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-default bg-card p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <LayoutDashboard className="size-4" />
          </span>
          <span className="font-bold">Admin</span>
        </div>
        <button
          onClick={openNew}
          className="mb-4 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="size-4" /> New post
        </button>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setEditing(null);
                setView(id);
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                view === id ? "bg-brand-500/10 text-brand-600" : "text-muted hover:bg-[var(--background)]"
              }`}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between border-t border-default pt-3">
          <ThemeToggle />
          <button
            onClick={() => {
              auth.clear();
              setAuthed(false);
            }}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:text-red-500"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between md:hidden">
          <span className="font-bold">Admin</span>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white"
          >
            <Plus className="size-4" /> New
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {view === "editor" ? (
          <PostEditor
            post={editing}
            categories={categories}
            tags={tags}
            onSaved={afterSave}
            onCancel={() => setView("posts")}
          />
        ) : view === "media" ? (
          <div className="mx-auto max-w-5xl">
            <h1 className="mb-6 text-2xl font-bold">Media Library</h1>
            <MediaLibrary />
          </div>
        ) : (
          <div className="mx-auto max-w-5xl">
            <h1 className="mb-6 text-2xl font-bold">Posts</h1>
            {loading ? (
              <div className="flex items-center gap-2 text-muted">
                <Loader2 className="size-4 animate-spin" /> Loading posts…
              </div>
            ) : (
              <PostsTable posts={posts} onEdit={openEdit} onChanged={load} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
