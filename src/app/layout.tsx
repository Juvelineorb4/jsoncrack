import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import { StyledComponentsRegistry } from "./styled-components-registry";
import { Providers } from "./providers";

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JSON Crack",
  price: "0",
  priceCurrency: "USD",
  operatingSystem: "Browser",
  keywords:
    "json, json viewer, json visualizer, json formatter, json editor, json parser, json to tree view, json to diagram, json graph, json beautifier, json validator, json to csv, json to yaml, json minifier, json schema, json data transformer, json api, online json viewer, online json formatter, online json editor, json tool",
  applicationCategory: "DeveloperApplication",
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "19" },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jsoncrack.com"),
  title: {
    default: "JSON Crack | Online JSON Viewer - Transform your data into interactive graphs",
    template: "%s | JSON Crack",
  },
  description:
    "JSON Crack Editor is a tool for visualizing into graphs, analyzing, editing, formatting, querying, transforming and validating JSON, CSV, YAML, XML, and more.",
  openGraph: {
    type: "website",
    url: "https://jsoncrack.com",
    title: "JSON Crack | Online JSON Viewer - Transform your data into interactive graphs",
    description:
      "JSON Crack Editor is a tool for visualizing into graphs, analyzing, editing, formatting, querying, transforming and validating JSON, CSV, YAML, XML, and more.",
    images: [
      {
        url: "https://jsoncrack.com/assets/jsoncrack.png",
        width: 1200,
        height: 627,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@jsoncrack",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48" }],
  },
  themeColor: "#36393E",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
