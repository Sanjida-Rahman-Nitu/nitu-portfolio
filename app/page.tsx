import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
import { About, CatalogueStrip, DataSources, Footer, Leadership, Research, Skills } from '@/components/Sections';
import Starfield from '@/components/Starfield';

export default function Home() {
  return (
    <>
      <Starfield />
      <CatalogueStrip />
      <main className="wrap">
        <Hero />
        <About />
        <Research />
        <DataSources />
        <Skills />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
