import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, LogOut, Plus, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useContent } from "../context/ContentContext";
import { Field, inputClassName, textareaClassName, PostEditor, ProjectEditor, WorkEditor } from "./admin/AdminEditor";

const TABS = ["Profile", "Work", "Projects", "Posts"];

function LoginForm({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const result = await onLogin(password);
    if (!result.ok) setError(result.error || "Login failed.");
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbf8f3] px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[2rem] border border-[#e6ddc7] bg-white/85 p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.25em] text-[#9e7d2f]">Admin</p>
        <h1 className="mt-2 font-serif text-3xl text-[#303624]">Sign in to edit your site</h1>
        <p className="mt-3 text-sm leading-6 text-[#6b7058]">This area is private. Visitors only see your public portfolio.</p>
        <label className="mt-6 block space-y-2 text-sm">
          <span className="font-medium text-[#42482f]">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClassName} required />
        </label>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <button type="submit" disabled={submitting} className="mt-6 w-full rounded-full bg-[#59613c] px-6 py-3 text-sm font-semibold text-white hover:bg-[#444b2f] disabled:opacity-60">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
        <Link to="/" className="mt-4 block text-center text-sm text-[#695b31] hover:text-[#9e7d2f]">
          Back to portfolio
        </Link>
      </form>
    </div>
  );
}

function ListRow({ title, subtitle, meta, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-[1.25rem] border border-[#e6ddc7] bg-white/85 p-5 text-left shadow-sm transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-md"
    >
      <div className="min-w-0 flex-1">
        <p className="font-serif text-lg text-[#303624]">{title}</p>
        {subtitle ? <p className="mt-1 text-sm text-[#6b7058]">{subtitle}</p> : null}
        {meta ? <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#9e7d2f]">{meta}</p> : null}
      </div>
      <ChevronRight className="shrink-0 text-[#9e7d2f]" size={20} />
    </button>
  );
}

function AddRow({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-[1.25rem] border border-dashed border-[#d6c081] bg-white/45 p-5 text-[#695b31] transition hover:bg-white/70"
    >
      <Plus size={18} />
      <span className="font-serif text-lg italic">Add {label}</span>
    </button>
  );
}

export default function AdminPage() {
  const { isAdmin, checking, login, logout } = useAuth();
  const { content, updateContent, saveContent, saveStatus, loading } = useContent();
  const [tab, setTab] = useState("Work");
  const [editor, setEditor] = useState(null);
  const [saving, setSaving] = useState(false);

  if (checking || loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#fbf8f3] text-[#62664f]">Loading admin…</div>;
  }

  if (!isAdmin) {
    return <LoginForm onLogin={login} />;
  }

  const saveAndStay = async () => {
    setSaving(true);
    await saveContent();
    setSaving(false);
  };

  const updateProfile = (field, value) => {
    updateContent((current) => ({
      ...current,
      profile: { ...current.profile, [field]: value },
    }));
  };

  const updateWorkItem = (index, field, value) => {
    updateContent((current) => {
      const featuredWork = [...current.featuredWork];
      featuredWork[index] = { ...featuredWork[index], [field]: value };
      return { ...current, featuredWork };
    });
  };

  const updateProjectItem = (index, field, value) => {
    updateContent((current) => {
      const projects = [...current.projects];
      projects[index] = { ...projects[index], [field]: value };
      return { ...current, projects };
    });
  };

  const updatePostItem = (index, field, value) => {
    updateContent((current) => {
      const posts = [...current.posts];
      posts[index] = { ...posts[index], [field]: value };
      return { ...current, posts };
    });
  };

  const openEditor = (type, slug) => setEditor({ type, slug });

  const addWork = () => {
    const slug = `new-role-${Date.now()}`;
    updateContent((current) => ({
      ...current,
      featuredWork: [
        ...current.featuredWork,
        {
          slug,
          company: "",
          role: "",
          type: "",
          timeline: "",
          location: "",
          description: "",
          tags: [],
          details: [""],
          takeaways: [""],
        },
      ],
    }));
    setTab("Work");
    setEditor({ type: "work", slug });
  };

  const addProject = () => {
    const slug = `new-project-${Date.now()}`;
    updateContent((current) => ({
      ...current,
      projects: [
        ...current.projects,
        {
          slug,
          title: "",
          category: "",
          blurb: "",
          tags: [],
          summary: "",
          strategy: [""],
          assets: [{ label: "", type: "Link", href: "#" }],
        },
      ],
    }));
    setTab("Projects");
    setEditor({ type: "project", slug });
  };

  const addPost = () => {
    const slug = `new-post-${Date.now()}`;
    updateContent((current) => ({
      ...current,
      posts: [
        ...current.posts,
        {
          slug,
          title: "",
          date: "Draft",
          readTime: "3 min read",
          topic: "Career",
          excerpt: "",
          sections: [{ heading: "", body: "" }],
        },
      ],
    }));
    setTab("Posts");
    setEditor({ type: "post", slug });
  };

  const workIndex = editor?.type === "work" ? content.featuredWork.findIndex((w) => w.slug === editor.slug) : -1;
  const projectIndex = editor?.type === "project" ? content.projects.findIndex((p) => p.slug === editor.slug) : -1;
  const postIndex = editor?.type === "post" ? content.posts.findIndex((p) => p.slug === editor.slug) : -1;

  const deleteCurrent = () => {
    if (!editor) return;
    if (!window.confirm("Delete this item? This cannot be undone until you save.")) return;

    if (editor.type === "work" && workIndex >= 0) {
      updateContent((current) => ({
        ...current,
        featuredWork: current.featuredWork.filter((_, i) => i !== workIndex),
      }));
    }
    if (editor.type === "project" && projectIndex >= 0) {
      updateContent((current) => ({
        ...current,
        projects: current.projects.filter((_, i) => i !== projectIndex),
      }));
    }
    if (editor.type === "post" && postIndex >= 0) {
      updateContent((current) => ({
        ...current,
        posts: current.posts.filter((_, i) => i !== postIndex),
      }));
    }
    setEditor(null);
  };

  return (
    <div className="min-h-screen bg-[#fbf8f3] text-[#2f3325]">
      <header className="border-b border-[#e6ddc7] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#9e7d2f]">Admin workspace</p>
            <h1 className="font-serif text-2xl text-[#303624]">{editor ? "Edit content" : "Manage content"}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/" className="rounded-full border border-[#d6c081] bg-white px-4 py-2 text-sm font-medium text-[#695b31]">
              View public site
            </Link>
            <button
              type="button"
              onClick={saveAndStay}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-[#59613c] px-5 py-2 text-sm font-semibold text-white hover:bg-[#444b2f] disabled:opacity-60"
            >
              <Save size={16} /> {saving ? "Saving…" : "Save all"}
            </button>
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-[#e6ddc7] bg-white px-4 py-2 text-sm text-[#695b31]">
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      </header>

      {saveStatus ? <p className="mx-auto max-w-6xl px-6 pt-4 text-sm text-[#59613c]">{saveStatus}</p> : null}

      <div className="mx-auto max-w-6xl px-6 py-8">
        {editor && workIndex >= 0 ? (
          <WorkEditor
            item={content.featuredWork[workIndex]}
            index={workIndex}
            onBack={() => setEditor(null)}
            onChange={updateWorkItem}
            onSave={saveAndStay}
            onDelete={deleteCurrent}
            saving={saving}
          />
        ) : editor && projectIndex >= 0 ? (
          <ProjectEditor
            item={content.projects[projectIndex]}
            index={projectIndex}
            onBack={() => setEditor(null)}
            onChange={updateProjectItem}
            onSave={saveAndStay}
            onDelete={deleteCurrent}
            saving={saving}
          />
        ) : editor && postIndex >= 0 ? (
          <PostEditor
            item={content.posts[postIndex]}
            index={postIndex}
            onBack={() => setEditor(null)}
            onChange={updatePostItem}
            onSave={saveAndStay}
            onDelete={deleteCurrent}
            saving={saving}
          />
        ) : (
          <>
            <div className="mb-8 flex flex-wrap gap-2">
              {TABS.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setTab(name)}
                  className={`rounded-full px-4 py-2 text-sm ${tab === name ? "bg-[#59613c] text-white" : "bg-white/80 text-[#62664f] hover:bg-[#eef1e4]"}`}
                >
                  {name}
                </button>
              ))}
            </div>

            {tab === "Profile" && (
              <div className="mx-auto max-w-2xl space-y-5 rounded-[2rem] border border-[#e6ddc7] bg-white/85 p-6">
                <p className="text-sm text-[#6b7058]">Update your name, headline, and contact info. Photo uses /neha-pfp.jpeg in the public folder.</p>
                {[
                  ["name", "Name"],
                  ["headline", "Headline (short line under your name on the site)"],
                  ["location", "Location"],
                  ["email", "Email"],
                ].map(([field, label]) => (
                  <Field key={field} label={label}>
                    <input className={inputClassName} value={content.profile[field]} onChange={(e) => updateProfile(field, e.target.value)} />
                  </Field>
                ))}
                <Field label="Intro (optional — not shown on homepage anymore)">
                  <textarea className={textareaClassName} rows={4} value={content.profile.intro} onChange={(e) => updateProfile("intro", e.target.value)} />
                </Field>
              </div>
            )}

            {tab === "Work" && (
              <div className="space-y-3">
                <p className="mb-4 text-sm text-[#6b7058]">Click any role to open the full editor — same fields as the public detail page.</p>
                {content.featuredWork.map((item) => (
                  <ListRow
                    key={item.slug}
                    title={item.company || "Untitled role"}
                    subtitle={item.role}
                    meta={item.tags?.join(" · ")}
                    onClick={() => openEditor("work", item.slug)}
                  />
                ))}
                <AddRow label="experience" onClick={addWork} />
              </div>
            )}

            {tab === "Projects" && (
              <div className="space-y-3">
                <p className="mb-4 text-sm text-[#6b7058]">Click a project to edit title, summary, strategy, tags, and linked assets.</p>
                {content.projects.map((project) => (
                  <ListRow
                    key={project.slug}
                    title={project.title || "Untitled project"}
                    subtitle={project.blurb}
                    meta={project.category}
                    onClick={() => openEditor("project", project.slug)}
                  />
                ))}
                <AddRow label="project" onClick={addProject} />
              </div>
            )}

            {tab === "Posts" && (
              <div className="space-y-3">
                <p className="mb-4 text-sm text-[#6b7058]">Click a post to rewrite the full article, tags, and excerpt.</p>
                {content.posts.map((post) => (
                  <ListRow
                    key={post.slug}
                    title={post.title || "Untitled post"}
                    subtitle={post.excerpt}
                    meta={`${post.topic} · ${post.date}`}
                    onClick={() => openEditor("post", post.slug)}
                  />
                ))}
                <AddRow label="post" onClick={addPost} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
