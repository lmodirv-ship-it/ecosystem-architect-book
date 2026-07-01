import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { EnergyLine, GlassCard, GlowIcon } from "@/components/hn/primitives";
import { HN_BIBLE_CHAPTERS, getChapterBySlug, type BibleChapter } from "@/lib/hn/bible";

export const Route = createFileRoute("/_app/foundation/bible/$chapter")({
  head: ({ params }) => {
    const c = getChapterBySlug(params.chapter);
    return {
      meta: [
        {
          title: c
            ? `Chapter ${c.n} — ${c.title} · HN Bible`
            : "Chapter · HN Bible",
        },
        {
          name: "description",
          content: c?.summary ?? "HN Platform Architecture Bible chapter.",
        },
      ],
    };
  },
  loader: ({ params }) => {
    const chapter = getChapterBySlug(params.chapter);
    if (!chapter) throw notFound();
    return { chapter };
  },
  component: ChapterPage,
  notFoundComponent: () => (
    <GlassCard className="p-8 text-center text-muted-foreground">
      Chapter not found.
    </GlassCard>
  ),
});

function ChapterPage() {
  const { chapter } = Route.useLoaderData() as { chapter: BibleChapter };
  const idx = HN_BIBLE_CHAPTERS.findIndex((c) => c.slug === chapter.slug);
  const prev = idx > 0 ? HN_BIBLE_CHAPTERS[idx - 1] : null;
  const next =
    idx < HN_BIBLE_CHAPTERS.length - 1 ? HN_BIBLE_CHAPTERS[idx + 1] : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6" dir="rtl">
      <GlassCard strong className="relative overflow-hidden p-8">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet/25 blur-3xl" />
        <div className="relative flex items-start gap-5">
          <GlowIcon icon={BookOpen} tone="violet" size="lg" />
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-violet">
              Chapter {chapter.n}
            </div>
            <h1 className="mt-1 font-display text-3xl font-bold text-foreground md:text-4xl">
              {chapter.title}
              <span className="mr-3 text-muted-foreground">
                — {chapter.arabicTitle}
              </span>
            </h1>
            <p className="mt-2 text-sm text-foreground/80 md:text-base">
              {chapter.summary}
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6 md:p-8">
        <div className="space-y-6">
          {chapter.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-lg font-semibold text-foreground">
                {s.heading}
              </h2>
              <EnergyLine className="my-3" />
              <p className="text-sm leading-loose text-foreground/85 md:text-base">
                {s.body}
              </p>
            </section>
          ))}
        </div>
      </GlassCard>

      <div className="flex items-center justify-between gap-3">
        {prev ? (
          <Link
            to="/foundation/bible/$chapter"
            params={{ chapter: prev.slug }}
            className="group flex items-center gap-2 rounded-xl hn-glass px-4 py-3 text-sm text-foreground/90 hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4 text-violet transition-transform group-hover:-translate-x-0.5" />
            <span>
              <span className="block text-[11px] text-muted-foreground">
                السابق · Chapter {prev.n}
              </span>
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/foundation/bible/$chapter"
            params={{ chapter: next.slug }}
            className="group flex items-center gap-2 rounded-xl hn-glass px-4 py-3 text-sm text-foreground/90 hover:text-foreground"
          >
            <span className="text-left">
              <span className="block text-[11px] text-muted-foreground">
                التالي · Chapter {next.n}
              </span>
              {next.title}
            </span>
            <ArrowLeft className="h-4 w-4 text-violet transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <Link
            to="/foundation/bible"
            className="rounded-xl hn-glass px-4 py-3 text-sm text-foreground/90 hover:text-foreground"
          >
            العودة إلى الفهرس
          </Link>
        )}
      </div>
    </div>
  );
}
