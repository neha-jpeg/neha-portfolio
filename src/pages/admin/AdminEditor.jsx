import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { slugify } from "../../lib/slug";

export function Field({ label, children, hint }) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-medium text-[#42482f]">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-[#7a8064]">{hint}</span> : null}
    </label>
  );
}

export const inputClassName =
  "w-full rounded-2xl border border-[#e6ddc7] bg-white/90 px-4 py-3 text-[#2f3325] outline-none focus:ring-2 focus:ring-[#9e7d2f]";

export const textareaClassName = `${inputClassName} resize-y`;

export function linesToArray(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function arrayToLines(value) {
  return (value || []).join("\n");
}

function EditorShell({ title, subtitle, onBack, onSave, onDelete, saving, children }) {
  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d6c081] bg-white/80 px-5 py-3 text-sm font-semibold text-[#695b31] shadow-sm"
      >
        <ArrowLeft size={16} /> Back to list
      </button>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#9e7d2f]">Editing</p>
        <h2 className="mt-2 font-serif text-3xl text-[#303624]">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm text-[#6b7058]">{subtitle}</p> : null}
      </div>

      <div className="space-y-5 rounded-[2rem] border border-[#e6ddc7] bg-white/85 p-6 shadow-sm md:p-8">{children}</div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-[#59613c] px-6 py-3 text-sm font-semibold text-white hover:bg-[#444b2f] disabled:opacity-60"
        >
          <Save size={16} /> {saving ? "Saving…" : "Save & publish"}
        </button>
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-3 text-sm font-medium text-red-700"
          >
            <Trash2 size={16} /> Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function WorkEditor({ item, index, onBack, onChange, onSave, onDelete, saving }) {
  return (
    <EditorShell
      title={item.company || "New experience"}
      subtitle={item.role}
      onBack={onBack}
      onSave={onSave}
      onDelete={onDelete}
      saving={saving}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Company">
          <input className={inputClassName} value={item.company} onChange={(e) => onChange(index, "company", e.target.value)} />
        </Field>
        <Field label="Role">
          <input className={inputClassName} value={item.role} onChange={(e) => onChange(index, "role", e.target.value)} />
        </Field>
        <Field label="Type">
          <input className={inputClassName} value={item.type} onChange={(e) => onChange(index, "type", e.target.value)} />
        </Field>
        <Field label="Timeline">
          <input className={inputClassName} value={item.timeline} onChange={(e) => onChange(index, "timeline", e.target.value)} />
        </Field>
        <Field label="Location">
          <input className={inputClassName} value={item.location} onChange={(e) => onChange(index, "location", e.target.value)} />
        </Field>
        <Field label="URL slug">
          <input className={inputClassName} value={item.slug} onChange={(e) => onChange(index, "slug", slugify(e.target.value))} />
        </Field>
      </div>
      <Field label="Card description (summary on main page)">
        <textarea className={textareaClassName} rows={3} value={item.description} onChange={(e) => onChange(index, "description", e.target.value)} />
      </Field>
      <Field label="Tags" hint="Comma separated — shown as pills on cards and detail page">
        <input
          className={inputClassName}
          value={item.tags.join(", ")}
          onChange={(e) => onChange(index, "tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
        />
      </Field>
      <Field label="What I did" hint="One bullet per line">
        <textarea className={textareaClassName} rows={5} value={arrayToLines(item.details)} onChange={(e) => onChange(index, "details", linesToArray(e.target.value))} />
      </Field>
      <Field label="Key takeaways" hint="One bullet per line">
        <textarea className={textareaClassName} rows={4} value={arrayToLines(item.takeaways)} onChange={(e) => onChange(index, "takeaways", linesToArray(e.target.value))} />
      </Field>
    </EditorShell>
  );
}

export function ProjectEditor({ item, index, onBack, onChange, onSave, onDelete, saving }) {
  return (
    <EditorShell
      title={item.title || "New project"}
      subtitle={item.category}
      onBack={onBack}
      onSave={onSave}
      onDelete={onDelete}
      saving={saving}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <input className={inputClassName} value={item.title} onChange={(e) => onChange(index, "title", e.target.value)} />
        </Field>
        <Field label="Category">
          <input className={inputClassName} value={item.category} onChange={(e) => onChange(index, "category", e.target.value)} />
        </Field>
        <Field label="URL slug">
          <input className={inputClassName} value={item.slug} onChange={(e) => onChange(index, "slug", slugify(e.target.value))} />
        </Field>
      </div>
      <Field label="Blurb (one line on projects list)">
        <textarea className={textareaClassName} rows={2} value={item.blurb} onChange={(e) => onChange(index, "blurb", e.target.value)} />
      </Field>
      <Field label="Summary (subtitle on detail page)">
        <textarea className={textareaClassName} rows={3} value={item.summary} onChange={(e) => onChange(index, "summary", e.target.value)} />
      </Field>
      <Field label="Tags" hint="Comma separated">
        <input
          className={inputClassName}
          value={item.tags.join(", ")}
          onChange={(e) => onChange(index, "tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
        />
      </Field>
      <Field label="Strategy + thought process" hint="One paragraph per line">
        <textarea className={textareaClassName} rows={5} value={arrayToLines(item.strategy)} onChange={(e) => onChange(index, "strategy", linesToArray(e.target.value))} />
      </Field>
      <Field label="Linked assets" hint="Format: label | type | url — one per line">
        <textarea
          className={textareaClassName}
          rows={4}
          value={item.assets.map((a) => `${a.label} | ${a.type} | ${a.href}`).join("\n")}
          onChange={(e) =>
            onChange(
              index,
              "assets",
              linesToArray(e.target.value).map((line) => {
                const [label, type, href] = line.split("|").map((part) => part.trim());
                return { label: label || "Asset", type: type || "Link", href: href || "#" };
              }),
            )
          }
        />
      </Field>
    </EditorShell>
  );
}

export function PostEditor({ item, index, onBack, onChange, onSave, onDelete, saving }) {
  return (
    <EditorShell
      title={item.title || "New post"}
      subtitle={`${item.topic} · ${item.date}`}
      onBack={onBack}
      onSave={onSave}
      onDelete={onDelete}
      saving={saving}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <input className={inputClassName} value={item.title} onChange={(e) => onChange(index, "title", e.target.value)} />
        </Field>
        <Field label="Topic / filter tag" hint="Use: AI Strategy, Operations, or Career">
          <input className={inputClassName} value={item.topic} onChange={(e) => onChange(index, "topic", e.target.value)} />
        </Field>
        <Field label="Date label">
          <input className={inputClassName} value={item.date} onChange={(e) => onChange(index, "date", e.target.value)} />
        </Field>
        <Field label="Read time">
          <input className={inputClassName} value={item.readTime} onChange={(e) => onChange(index, "readTime", e.target.value)} />
        </Field>
        <Field label="URL slug">
          <input className={inputClassName} value={item.slug} onChange={(e) => onChange(index, "slug", slugify(e.target.value))} />
        </Field>
      </div>
      <Field label="Excerpt (subtitle on detail page)">
        <textarea className={textareaClassName} rows={3} value={item.excerpt} onChange={(e) => onChange(index, "excerpt", e.target.value)} />
      </Field>
      <Field label="Article sections" hint="Write heading on first line, body below. Separate sections with a blank line.">
        <textarea
          className={textareaClassName}
          rows={10}
          value={item.sections.map((s) => `${s.heading}\n${s.body}`).join("\n\n")}
          onChange={(e) =>
            onChange(
              index,
              "sections",
              e.target.value
                .split("\n\n")
                .map((block) => block.trim())
                .filter(Boolean)
                .map((block) => {
                  const [heading, ...rest] = block.split("\n");
                  return { heading: heading.trim(), body: rest.join("\n").trim() };
                }),
            )
          }
        />
      </Field>
    </EditorShell>
  );
}
