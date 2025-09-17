import type { Metadata } from "next";
import { DocsPage } from "./DocsPage";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Integrate JSON Crack widgets into your website.",
  alternates: { canonical: "/docs" },
};

export default function Page() {
  return <DocsPage />;
}
