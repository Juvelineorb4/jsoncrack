import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileFormat, formats, TypeLanguage, typeOptions } from "../../../enums/file.enum";
import { TypegenWrapper } from "../../../layout/TypeLayout/TypegenWrapper";

const typeConversions = [
  { slug: "csv-to-go", from: FileFormat.CSV, to: TypeLanguage.Go },
  { slug: "csv-to-kotlin", from: FileFormat.CSV, to: TypeLanguage.Kotlin },
  { slug: "csv-to-rust", from: FileFormat.CSV, to: TypeLanguage.Rust },
  { slug: "csv-to-typescript", from: FileFormat.CSV, to: TypeLanguage.TypeScript },
  { slug: "json-to-go", from: FileFormat.JSON, to: TypeLanguage.Go },
  { slug: "json-to-kotlin", from: FileFormat.JSON, to: TypeLanguage.Kotlin },
  { slug: "json-to-rust", from: FileFormat.JSON, to: TypeLanguage.Rust },
  { slug: "json-to-typescript", from: FileFormat.JSON, to: TypeLanguage.TypeScript },
  { slug: "xml-to-go", from: FileFormat.XML, to: TypeLanguage.Go },
  { slug: "xml-to-kotlin", from: FileFormat.XML, to: TypeLanguage.Kotlin },
  { slug: "xml-to-rust", from: FileFormat.XML, to: TypeLanguage.Rust },
  { slug: "xml-to-typescript", from: FileFormat.XML, to: TypeLanguage.TypeScript },
  { slug: "yaml-to-go", from: FileFormat.YAML, to: TypeLanguage.Go },
  { slug: "yaml-to-kotlin", from: FileFormat.YAML, to: TypeLanguage.Kotlin },
  { slug: "yaml-to-rust", from: FileFormat.YAML, to: TypeLanguage.Rust },
  { slug: "yaml-to-typescript", from: FileFormat.YAML, to: TypeLanguage.TypeScript },
] as const;
type TypeConverterSlug = (typeof typeConversions)[number]["slug"];

const conversionMap = new Map<TypeConverterSlug, (typeof typeConversions)[number]>(
  typeConversions.map(conversion => [conversion.slug, conversion])
);

const getFormatLabel = (format: FileFormat) => formats.find(({ value }) => value === format)?.label;
const getTypeLabel = (language: TypeLanguage) =>
  typeOptions.find(({ value }) => value === language)?.label;

export function generateStaticParams(): { slug: TypeConverterSlug }[] {
  return typeConversions.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: TypeConverterSlug } }): Metadata {
  const conversion = conversionMap.get(params.slug);

  if (!conversion) {
    return {};
  }

  const fromLabel = getFormatLabel(conversion.from);
  const toLabel = getTypeLabel(conversion.to);

  return {
    title: `${fromLabel} to ${toLabel}`,
    description: `Instantly generate ${toLabel} from ${fromLabel} using this free online tool. Paste your ${fromLabel} and get the generated ${toLabel} instantly.`,
    alternates: { canonical: `/type/${params.slug}` },
  };
}

export default function Page({ params }: { params: { slug: TypeConverterSlug } }) {
  const conversion = conversionMap.get(params.slug);

  if (!conversion) {
    notFound();
  }

  return <TypegenWrapper from={conversion.from} to={conversion.to} />;
}
