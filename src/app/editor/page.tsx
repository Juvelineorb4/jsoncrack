import type { Metadata } from "next";
import { EditorPage } from "./EditorPage";

export const metadata: Metadata = {
  title: "Editor",
  description:
    "JSON Crack Editor is a tool for visualizing into graphs, analyzing, editing, formatting, querying, transforming and validating JSON, CSV, YAML, XML, and more.",
  alternates: { canonical: "/editor" },
};

export default function Page() {
  return <EditorPage />;
}
