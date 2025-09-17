import type { Metadata } from "next";
import { WidgetPage } from "./WidgetPage";

export const metadata: Metadata = {
  title: "Widget",
  alternates: { canonical: "/widget" },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <WidgetPage />;
}
