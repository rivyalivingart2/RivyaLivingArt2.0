import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { findCollection } from "@/lib/catalogue";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";
import { FurnitureCollection } from "@/components/furniture-collection";
import { MemoryCollection, PersonalArtCollection } from "@/components/art-collections";

type Props = {
  params: Promise<{ collection: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isVisualPreviewAllowed(process.env)) return { title: "Not found" };
  const collection = findCollection((await params).collection);
  return { title: collection?.label ?? "Not found" };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  await connection();
  if (!isVisualPreviewAllowed(process.env)) notFound();
  const collection = findCollection((await params).collection);
  if (!collection) notFound();
  if (collection.tier === "LARGE") {
    return <FurnitureCollection searchParams={await searchParams} />;
  }
  if (collection.tier === "MEDIUM") return <MemoryCollection searchParams={await searchParams} />;
  return <PersonalArtCollection searchParams={await searchParams} />;
}
