import type { Metadata } from "next";
import { JsonSchemaToolPage } from "./JsonSchemaToolPage";

export const metadata: Metadata = {
  title: "JSON Schema Validator & Generator",
  description:
    "Use our JSON Schema Validator & Generator tool to easily validate and generate JSON schemas, and generate data from JSON schemas.",
  alternates: { canonical: "/tools/json-schema" },
};

export default function Page() {
  return <JsonSchemaToolPage />;
}
