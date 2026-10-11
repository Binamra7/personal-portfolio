import { Career } from "@/components/Career";
import { Contact } from "@/components/Contact";
import { Dock } from "@/components/Dock";
import { Education } from "@/components/Education";
import { Hero } from "@/components/Hero";
import { SiteFooter } from "@/components/SiteFooter";
import { Stack } from "@/components/Stack";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Work />
        <Career />
        <Education />
        <Stack />
        <Contact />
      </main>
      <SiteFooter />
      <Dock />
    </>
  );
}
