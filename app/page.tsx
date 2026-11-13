import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
import Nav, { type NavItem } from '@/components/Nav';
import { About, CatalogueStrip, DataSources, Footer, Leadership, Notes, Research, Skills } from '@/components/Sections';
import Starfield from '@/components/Starfield';
import { publishedNotes } from '@/data/content';

const navItems: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'data', label: 'Data' },
  { id: 'skills', label: 'Skills' },
  { id: 'leadership', label: 'Leadership' },
  ...(publishedNotes.length ? [{ id: 'notes', label: 'Notes' }] : []),
  { id: 'contact', label: 'Contact' },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Starfield />
      <div id="top" />
      <CatalogueStrip />
      <Nav items={navItems} />
      <main className="wrap" id="main">
        <Hero />
        <About />
        <Research />
        <DataSources />
        <Skills />
        <Leadership />
        <Notes />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
