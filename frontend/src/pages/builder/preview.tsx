// hosting/frontend/src/pages/builder/preview.tsx
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import type { SectionId, TemplateSection } from "@/types/Builder";
import { findTemplateBySlug, TEMPLATE_SECTIONS } from "@/components/web_builder/templates.data";
import SectionManager from "@/components/web_builder/SectionManager";
import PreviewCanvas from "@/components/web_builder/PreviewCanvas";
import { useSession } from "next-auth/react";
import { saveBuilderSnapshot } from "@/lib/api";

export default function BuilderPreviewPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const isReady = router.isReady;
  const slugParam = isReady ? router.query.template : undefined;

  const slug = useMemo(() => {
    if (typeof slugParam === "string") return slugParam;
    if (Array.isArray(slugParam)) return slugParam[0];
    return undefined;
  }, [slugParam]);

  const template = useMemo(() => (slug ? findTemplateBySlug(slug) : undefined), [slug]);

  const defaultSections: TemplateSection[] = useMemo(
    () => (slug ? TEMPLATE_SECTIONS[slug] ?? [] : []),
    [slug]
  );

  const [enabled, setEnabled] = useState<Record<SectionId, boolean>>({} as Record<SectionId, boolean>);
  const [order, setOrder] = useState<SectionId[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string>("");

  useEffect(() => {
    if (!isReady) return;
    const initEnabled: Record<SectionId, boolean> = {} as Record<SectionId, boolean>;
    const initOrder: SectionId[] = [];
    for (const s of defaultSections) {
      initEnabled[s.id] = s.enabledByDefault;
      initOrder.push(s.id);
    }
    setEnabled(initEnabled);
    setOrder(initOrder);
  }, [isReady, defaultSections]);

  if (!isReady) {
    return (
      <>
        <Head>
          <title>Loading… | Builder Preview</title>
          <meta name="robots" content="noindex" />
        </Head>
        <main className="container mx-auto px-4 md:px-6 py-16">
          <div className="animate-pulse rounded-2xl border p-6">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
            <div className="h-4 w-80 bg-gray-100 rounded" />
          </div>
        </main>
      </>
    );
  }

  if (!slug || !template) {
    return (
      <>
        <Head>
          <title>Template not found | Builder Preview</title>
          <meta name="robots" content="noindex" />
        </Head>
        <main className="container mx-auto px-4 md:px-6 py-16">
          <div className="rounded-2xl border p-6">
            <h1 className="text-xl font-semibold">Template not found</h1>
            <p className="mt-2 text-gray-600">
              We couldn’t find a template for this preview. Please go back and choose one.
            </p>
            <div className="mt-4">
              <Link
                href="/builder"
                className="inline-flex items-center rounded-xl border px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring"
              >
                Back to templates
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const onSave = async () => {
    setSaveMsg("");
    if (!session?.appToken) {
      setSaveMsg("Please log in to save.");
      return;
    }
    try {
      setSaving(true);
      const res = await saveBuilderSnapshot({
        token: session.appToken as string,
        templateSlug: slug,
        projectName: template.title,
        order,
        enabled,
      });
      setSaveMsg(`Saved! Project #${res.projectId}, Page #${res.pageId}, blocks: ${res.synced}.`);
    } catch (e) {
      setSaveMsg(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>Preview – {template.title} | Builder</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Website Builder – Preview</h1>
          <div className="flex items-center gap-3">
            {saveMsg && <span className="text-sm text-gray-600">{saveMsg}</span>}
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center rounded-xl border px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save to Project"}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <SectionManager
            sections={defaultSections}
            value={enabled}
            order={order}
            onToggleChange={setEnabled}
            onReorder={setOrder}
          />
          <PreviewCanvas template={template} enabled={enabled} order={order} />
        </div>
      </main>
    </>
  );
}
