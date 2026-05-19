import React, { useMemo, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, FileText, Link, Mail, MapPin, Tags } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { navItems } from "../../data/defaultContent";
import { ProfilePhoto } from "../ProfilePhoto";
import { HeroPortrait } from "../HeroPortrait";

function Pill({ children }) {
  return <span className="rounded-full border border-[#d8c89e]/60 bg-white/75 px-3 py-1 text-xs text-[#5e6243]">{children}</span>;
}

function SectionLabel({ icon: Icon, children }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#eef1e4] px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#68704a]">
      <Icon size={14} />
      {children}
    </div>
  );
}

function LogoMark({ profile }) {
  return (
    <a href="#top" className="group flex items-center gap-3" aria-label="Neha Jha home">
      <div className="overflow-hidden rounded-[1.15rem] border border-[#d8c89e] shadow-sm transition duration-300 group-hover:scale-95 group-hover:shadow-inner">
        <ProfilePhoto
          src={profile.avatarUrl || "/neha-pfp.jpeg"}
          alt={profile.name}
          size="sm"
          rounded="rounded-[1.15rem]"
          position={profile.avatarPosition || "center 20%"}
        />
      </div>
      <p className="hidden font-serif text-lg italic text-[#3f472d] sm:block">Neha</p>
    </a>
  );
}

function CursorGlow() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 180, damping: 24 });
  const springY = useSpring(cursorY, { stiffness: 180, damping: 24 });

  React.useEffect(() => {
    const move = (event) => {
      cursorX.set(event.clientX - 80);
      cursorY.set(event.clientY - 80);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed z-50 hidden h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(214,192,129,0.35)_0%,rgba(242,219,226,0.18)_42%,rgba(251,248,243,0)_72%)] blur-sm md:block"
      style={{ x: springX, y: springY }}
    />
  );
}

const pressable = "transition duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-inner active:translate-x-1 active:translate-y-1 active:shadow-inner";

function DetailShell({ backLabel, onBack, eyebrow, title, subtitle, tags, children }) {
  return (
    <main className="relative mx-auto max-w-5xl px-6 pb-24 pt-10">
      <button
        onClick={onBack}
        className={`mb-10 inline-flex items-center gap-2 rounded-full border border-[#d6c081] bg-white/80 px-5 py-3 text-sm font-semibold text-[#695b31] shadow-sm ${pressable}`}
      >
        <ArrowLeft size={16} /> {backLabel}
      </button>

      <motion.article initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-[2.4rem] border border-[#e6ddc7] bg-white/82 p-7 shadow-xl backdrop-blur md:p-12">
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#9e7d2f]">{eyebrow}</p>
        <h1 className="font-serif text-4xl leading-tight tracking-tight text-[#303624] md:text-6xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#62664f]">{subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {tags?.map((tag) => <Pill key={tag}>{tag}</Pill>)}
        </div>
        <motion.div className="my-10 h-px bg-[#e6ddc7]" />
        {children}
      </motion.article>
    </main>
  );
}

function WorkPage({ work, onBack }) {
  return (
    <DetailShell backLabel="Back to work" onBack={onBack} eyebrow={`${work.type} • ${work.timeline}`} title={`${work.company} — ${work.role}`} subtitle={work.description} tags={work.tags}>
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <section>
          <h2 className="font-serif text-3xl text-[#4f5934]">What I did</h2>
          <div className="mt-5 space-y-4">
            {work.details.map((item) => (
              <p key={item} className="rounded-3xl bg-[#fbf8f3] p-5 text-sm leading-7 text-[#555b46] ring-1 ring-[#e6ddc7]">{item}</p>
            ))}
          </div>
        </section>
        <aside>
          <h2 className="font-serif text-3xl text-[#4f5934]">Key takeaways</h2>
          <div className="mt-5 space-y-3">
            {work.takeaways.map((item, index) => (
              <div key={item} className="flex gap-4 rounded-3xl bg-[#f7eee9] p-5 text-sm leading-7 text-[#5f644e]">
                <span className="font-serif text-2xl italic text-[#d1aa51]">0{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-3xl bg-[#eef1e4] p-5 text-sm text-[#68704a]">
            <p className="font-semibold">Location</p>
            <p className="mt-1">{work.location}</p>
          </div>
        </aside>
      </div>
    </DetailShell>
  );
}

function ProjectPage({ project, onBack }) {
  return (
    <DetailShell backLabel="Back to projects" onBack={onBack} eyebrow={project.category} title={project.title} subtitle={project.summary} tags={project.tags}>
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <section>
          <h2 className="font-serif text-3xl text-[#4f5934]">Strategy + thought process</h2>
          <div className="mt-5 space-y-5">
            {project.strategy.map((item, index) => (
              <div key={item} className="rounded-3xl border border-[#e6ddc7] bg-[#fbf8f3] p-6">
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#9e7d2f]">Step 0{index + 1}</p>
                <p className="text-sm leading-7 text-[#555b46]">{item}</p>
              </div>
            ))}
          </div>
        </section>
        <aside>
          <h2 className="font-serif text-3xl text-[#4f5934]">Linked assets</h2>
          <p className="mt-3 text-sm leading-7 text-[#6b7058]">Use this area for screenshots, decks, PDFs, live links, Notion pages, or files. Replace the href values with real links when the site is published.</p>
          <div className="mt-5 space-y-3">
            {project.assets.map((asset) => (
              <a key={asset.label} href={asset.href} className={`flex items-center justify-between rounded-3xl bg-[#f7eee9] p-5 text-left text-sm text-[#5f644e] shadow-sm ${pressable}`}>
                <span>
                  <span className="block font-semibold text-[#353b28]">{asset.label}</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-[#9e7d2f]">{asset.type}</span>
                </span>
                <Link size={17} />
              </a>
            ))}
          </div>
        </aside>
      </div>
    </DetailShell>
  );
}

function PostPage({ post, onBack }) {
  return (
    <DetailShell backLabel="Back to writing" onBack={onBack} eyebrow={`${post.topic} • ${post.date} • ${post.readTime}`} title={post.title} subtitle={post.excerpt} tags={[post.topic]}>
      <div className="space-y-10">
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-serif text-2xl text-[#4f5934] md:text-3xl">{section.heading}</h2>
            <p className="mt-4 text-base leading-8 text-[#555b46]">{section.body}</p>
          </section>
        ))}
      </div>
    </DetailShell>
  );
}

export default function Portfolio() {
  const { content, loading } = useContent();
  const { profile, featuredWork, projects, posts, filters } = content;

  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPostSlug, setSelectedPostSlug] = useState(null);
  const [selectedWorkSlug, setSelectedWorkSlug] = useState(null);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState(null);

  const selectedPost = posts.find((post) => post.slug === selectedPostSlug);
  const selectedWork = featuredWork.find((work) => work.slug === selectedWorkSlug);
  const selectedProject = projects.find((project) => project.slug === selectedProjectSlug);

  const visiblePosts = useMemo(() => {
    if (activeFilter === "All") return posts;
    return posts.filter((post) => post.topic === activeFilter);
  }, [activeFilter, posts]);

  if (loading) {
    return (
      <motion.div className="flex min-h-screen items-center justify-center bg-[#fbf8f3] text-[#62664f]">
        Loading portfolio…
      </motion.div>
    );
  }

  const goHome = () => {
    setSelectedPostSlug(null);
    setSelectedWorkSlug(null);
    setSelectedProjectSlug(null);
  };

  return (
    <div className="min-h-screen bg-[#fbf8f3] text-[#2f3325]">
      <CursorGlow />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgba(89,97,60,0.055)_1px,transparent_1px),linear-gradient(0deg,rgba(89,97,60,0.045)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-[#fbf8f3] to-transparent" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <LogoMark profile={profile} />
        <nav className="hidden gap-6 rounded-full border border-[#e6ddc7] bg-white/75 px-6 py-3 text-sm text-[#5b6144] shadow-sm backdrop-blur md:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={goHome} className="transition hover:translate-y-0.5 hover:text-[#9e7d2f]">
              {item}
            </a>
          ))}
        </nav>
      </header>

      {selectedWork ? (
        <WorkPage work={selectedWork} onBack={goHome} />
      ) : selectedProject ? (
        <ProjectPage project={selectedProject} onBack={goHome} />
      ) : selectedPost ? (
        <PostPage post={selectedPost} onBack={goHome} />
      ) : (
        <main id="top" className="relative mx-auto max-w-6xl px-6 pb-20">
          <section className="grid min-h-[78vh] items-center gap-12 py-16 md:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <h1 className="max-w-4xl font-serif text-6xl leading-[0.98] tracking-tight text-[#303624] md:text-8xl">
                Hi, I'm Neha
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-[#62664f]">{profile.headline}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#work" className={`rounded-full bg-[#59613c] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#444b2f] ${pressable}`}>
                  Explore my work
                </a>
                <a href="#writing" className={`rounded-full border border-[#d6c081] bg-white/80 px-6 py-3 text-sm font-semibold text-[#695b31] shadow-sm ${pressable}`}>
                  Read my notes
                </a>
              </div>
            </motion.div>
            <HeroPortrait profile={profile} />
          </section>

          <section id="work" className="py-20">
            <SectionLabel icon={BriefcaseBusiness}>Selected Work</SectionLabel>
            <h2 className="mb-8 max-w-2xl font-serif text-4xl tracking-tight md:text-5xl">Experience with a through-line.</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {featuredWork.map((item) => (
                <button key={item.company} onClick={() => setSelectedWorkSlug(item.slug)} className="group rounded-[2rem] border border-[#e6ddc7] bg-white/78 p-6 text-left shadow-sm backdrop-blur transition duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-inner">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#9e7d2f]">{item.type}</p>
                      <h3 className="mt-3 font-serif text-2xl text-[#42482f]">{item.company}</h3>
                      <p className="mt-1 text-sm text-[#7a8064]">{item.role}</p>
                    </div>
                    <ArrowUpRight className="text-[#9e7d2f] transition group-hover:translate-x-1 group-hover:translate-y-1" size={20} />
                  </div>
                  <p className="text-sm leading-6 text-[#5f644e]">{item.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.tags.map((tag) => <Pill key={tag}>{tag}</Pill>)}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section id="projects" className="py-20">
            <SectionLabel icon={Tags}>Projects</SectionLabel>
            <motion.div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 className="font-serif text-4xl tracking-tight md:text-5xl">Graphic, strategic, and actually useful.</h2>
              </div>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <button key={project.title} onClick={() => setSelectedProjectSlug(project.slug)} className="group w-full rounded-[1.8rem] border border-[#e6ddc7] bg-white/78 p-6 text-left shadow-sm transition duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-inner">
                    <div className="flex gap-5">
                      <span className="font-serif text-3xl italic text-[#d1aa51]">0{index + 1}</span>
                      <div className="flex-1">
                        <motion.div className="flex items-start justify-between gap-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-[#8d6572]">{project.category}</p>
                          <ArrowUpRight className="text-[#9e7d2f] transition group-hover:translate-x-1 group-hover:translate-y-1" size={18} />
                        </motion.div>
                        <h3 className="mt-2 text-xl font-semibold text-[#353b28]">{project.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#636852]">{project.blurb}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </section>

          <section id="writing" className="py-20">
            <SectionLabel icon={FileText}>Writing</SectionLabel>
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <h2 className="font-serif text-4xl tracking-tight md:text-5xl">Notes, essays, and thinking out loud.</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full px-4 py-2 text-sm shadow-sm ${pressable} ${activeFilter === filter ? "bg-[#59613c] text-white" : "bg-white/80 text-[#62664f] hover:bg-[#eef1e4]"}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {visiblePosts.map((post) => (
                <button
                  key={post.title}
                  onClick={() => setSelectedPostSlug(post.slug)}
                  className="group rounded-[2rem] border border-[#e6ddc7] bg-[#fffaf7]/86 p-6 text-left shadow-sm transition duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-inner"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#9e7d2f]">{post.date}</p>
                    <ArrowUpRight className="text-[#9e7d2f] transition group-hover:translate-x-1 group-hover:translate-y-1" size={18} />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold leading-7 text-[#333828]">{post.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#62664f]">{post.excerpt}</p>
                  <motion.div className="mt-5"><Pill>{post.topic}</Pill></motion.div>
                </button>
              ))}
            </div>
          </section>

          <section id="contact" className="flex flex-col items-center py-20 text-center">
            <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-[#f2dbe2] px-4 py-2 text-sm text-[#805c68]"><Mail size={15} /> Open to strategy, BD, ops, and AI product conversations</p>
            <a href={`mailto:${profile.email}`} className={`inline-flex rounded-full bg-[#59613c] px-7 py-4 text-sm font-semibold text-white shadow-md hover:bg-[#444b2f] ${pressable}`}>
              Email me
            </a>
          </section>
        </main>
      )}
    </div>
  );
}
