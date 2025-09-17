import type { Metadata } from "next";
import { PrivacyPage } from "./PrivacyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "JSON Crack Privacy Policy",
  alternates: { canonical: "/legal/privacy" },
};

export default function Page() {
  return <PrivacyPage />;
}
