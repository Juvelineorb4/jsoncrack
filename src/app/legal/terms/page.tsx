import type { Metadata } from "next";
import { TermsPage } from "./TermsPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "JSON Crack Terms of Service",
  alternates: { canonical: "/legal/terms" },
};

export default function Page() {
  return <TermsPage />;
}
