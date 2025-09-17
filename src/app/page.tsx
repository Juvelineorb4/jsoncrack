import type { Metadata } from "next";
import { FAQ } from "../layout/Landing/FAQ";
import { Features } from "../layout/Landing/Features";
import { HeroPreview } from "../layout/Landing/HeroPreview";
import { HeroSection } from "../layout/Landing/HeroSection";
import { Section1 } from "../layout/Landing/Section1";
import { Section2 } from "../layout/Landing/Section2";
import { Section3 } from "../layout/Landing/Section3";
import Layout from "../layout/PageLayout";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

async function getRepositoryStars() {
  try {
    const response = await fetch("https://api.github.com/repos/AykutSarac/jsoncrack.com", {
      headers: {
        Accept: "application/vnd.github+json",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return data?.stargazers_count ?? 0;
  } catch (error) {
    return 0;
  }
}

export default async function Page() {
  const stars = await getRepositoryStars();

  return (
    <Layout>
      <HeroSection stars={stars} />
      <HeroPreview />
      <Section1 />
      <Section2 />
      <Section3 />
      <Features />
      <FAQ />
    </Layout>
  );
}
