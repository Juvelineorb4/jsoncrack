import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileFormat, formats } from "../../../enums/file.enum";
import { ToolPage } from "../../../layout/ConverterLayout/ToolPage";

const conversions = [
  { slug: "csv-to-json", from: FileFormat.CSV, to: FileFormat.JSON },
  { slug: "csv-to-xml", from: FileFormat.CSV, to: FileFormat.XML },
  { slug: "csv-to-yaml", from: FileFormat.CSV, to: FileFormat.YAML },
  { slug: "json-to-csv", from: FileFormat.JSON, to: FileFormat.CSV },
  { slug: "json-to-xml", from: FileFormat.JSON, to: FileFormat.XML },
  { slug: "json-to-yaml", from: FileFormat.JSON, to: FileFormat.YAML },
  { slug: "xml-to-csv", from: FileFormat.XML, to: FileFormat.CSV },
  { slug: "xml-to-json", from: FileFormat.XML, to: FileFormat.JSON },
  { slug: "xml-to-yaml", from: FileFormat.XML, to: FileFormat.YAML },
  { slug: "yaml-to-csv", from: FileFormat.YAML, to: FileFormat.CSV },
  { slug: "yaml-to-json", from: FileFormat.YAML, to: FileFormat.JSON },
  { slug: "yaml-to-xml", from: FileFormat.YAML, to: FileFormat.XML },
] as const;
type ConverterSlug = (typeof conversions)[number]["slug"];

const conversionMap = new Map<ConverterSlug, (typeof conversions)[number]>(
  conversions.map(conversion => [conversion.slug, conversion])
);

const getLabel = (format: FileFormat) => formats.find(({ value }) => value === format)?.label;

export function generateStaticParams(): { slug: ConverterSlug }[] {
  return conversions.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: ConverterSlug } }): Metadata {
  const conversion = conversionMap.get(params.slug);

  if (!conversion) {
    return {};
  }

  const fromLabel = getLabel(conversion.from);
  const toLabel = getLabel(conversion.to);

  return {
    title: `${fromLabel} to ${toLabel}`,
    description: `Convert ${fromLabel} to ${toLabel} using this free online tool. Upload your ${fromLabel} file and get the converted ${toLabel} file instantly.`,
    alternates: { canonical: `/converter/${params.slug}` },
  };
}

export default function Page({ params }: { params: { slug: ConverterSlug } }) {
  const conversion = conversionMap.get(params.slug);

  if (!conversion) {
    notFound();
  }

  return <ToolPage from={conversion.from} to={conversion.to} />;
}
