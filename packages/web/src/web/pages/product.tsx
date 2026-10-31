import { useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, ArrowDown, ArrowRight, ChevronRight, Plus, Minus, Gamepad2, Cpu, Crosshair, Fingerprint, MoveUpRight, Menu, X } from 'lucide-react';
import { useSequence } from '../hooks/use-sequence';

const chapters = [
  { name: 'La rencontre', start: 0, eyebrow: 'PAIKON PLUS  /  NOUVELLE GÉNÉRATION', title: <>Le jeu.<br /><span>À l’état pur.</span></>, text: 'Une précision instinctive. Une immersion totale. Découvrez la manette qui donne une nouvelle dimension à chaque geste.', detail: 'Une autre idée du contrôle.', label: 'Design translucide' },
  { name: 'L’éveil', start: .3, eyebrow: '01 / L’ÉVEIL DES SENS', title: <>L’intérieur.<br /><span>Prend vie.</span></>, text: 'La lumière traverse la matière. Sous les boutons translucides, chaque détail révèle une technologie pensée pour vous.', detail: 'La technologie, mise en lumière.', label: 'Éclairage RGB intégré' },
  { name: 'L’ingénierie', start: .6, eyebrow: '02 / AU CŒUR DU CONTRÔLE', title: <>Rien n’est<br /><span>laissé au hasard.</span></>, text: 'Joysticks à effet Hall, moteurs haptiques et gâchettes à résistance variable. Chaque composant a un rôle. Chaque geste a une réponse.', detail: 'L’exigence jusque dans l’invisible.', label: 'Architecture de précision' },
  { name: 'Votre empreinte', start: .9, eyebrow: '03 / DANS LE CREUX DE VOS MAINS', title: <>Votre jeu.<br /><span>Vos règles.</span></>, text: 'Des grips finement texturés. Quatre commandes arrière personnalisables. Une prise en main qui prolonge votre instinct.', detail: 'Pensée pour ne faire qu’un avec vous.', label: 'Grips & palettes arrière' },
];

const features = [
  { icon: Crosshair, number: '01', name: 'La précision, sans contact.', tag: 'JOYSTICKS HALL EFFECT', text: 'Des capteurs magnétiques suivent vos mouvements sans friction mécanique. Une nouvelle approche de la précision.', image: '/images/hero-on.webp', position: 'left center' },
  { icon: Fingerprint, number: '02', name: 'Ressentez la différence.', tag: 'GÂCHETTES ADAPTATIVES', text: 'Une résistance qui évolue avec l’action et un retour haptique qui donne du relief à chaque instant.', image: '/images/exploded.webp', position: 'center center' },
  { icon: Cpu, number: '03', name: 'L’ingénierie à découvert.', tag: 'DESIGN TRANSLUCIDE', text: 'Une coque fumée révèle l’architecture du produit. La lumière souligne la technologie, sans jamais lui voler la vedette.', image: '/images/rear.webp', position: 'right center' },
];

function Mark() {
  return <svg viewBox="0 0 32 32" width="28" height="28" fill="none" aria-hidden="true"><path d="M4 25V7h12l-4 6H9v12H4Zm10 0 10-18h6L20 25h-6Z" fill="currentColor" /></svg>;
}

export default function ProductPage() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { progress: p, ready, buffering, failed, goTo } = useSequence(section, canvas);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [gameOpened, setGameOpened] = useState(false);
  const current = p < .3 ? 0 : p < .6 ? 1 : p < .9 ? 2 : 3;
  const gameFade = Math.max(0, Math.min(1, (p - .965) / .035));
  const navigate = (value: number) => { setMenuOpen(false); goTo(value); };
  const faqs = [
    ['Qu’est-ce qu’un joystick à effet Hall ?', 'Contrairement à un potentiomètre classique, un capteur à effet Hall mesure la position à l’aide d’un champ magnétique. L’absence de contact au niveau de la mesure réduit l’usure liée au frottement.'],
    ['Comment fonctionne cette présentation ?', 'Votre scroll est la timeline : descendez pour avancer, remontez pour revenir en arrière. Cette démonstration utilise 181 images optimisées, avec un cache de décodage limité et un chargement progressif. Aucune vidéo n’est lue automatiquement.'],
    ['Peut-on acheter Paikon Plus ?', 'Paikon Plus est un concept de démonstration, pas un produit commercialisé. Les visuels et fonctionnalités illustrent une direction de design. Aucun prix, disponibilité ou compatibilité commerciale n’est annoncé.'],
  ];

  return <main>
    <header className="header">
      <button className="brand" onClick={() => navigate(0)} aria-label="Paikon, retour au début"><Mark /><span>paikon<span className="brand-dot">.</span></span></button>
      <nav className={menuOpen ? 'header-nav is-open' : 'header-nav'} aria-label="Navigation principale">
        <button onClick={() => navigate(0)} className={current === 0 ? 'active' : ''}>La manette</button>
        <button onClick={() => navigate(.64)} className={current === 2 ? 'active' : ''}>La technologie</button>
        <a href="#details" onClick={() => setMenuOpen(false)}>Les détails</a>
      </nav>
      <button className="header-cta" onClick={() => navigate(.31)}>Explorer Paikon Plus <ArrowUpRight size={15} /></button>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <section ref={section} className="scroll-story" id="experience" aria-label="Présentation produit contrôlée par le scroll">
      <div className="pinned-stage" style={{ '--progress': p } as CSSProperties}>
        <div className="stage-grid" aria-hidden="true" />
        <div className="stage-top"><span><span className="status-dot" /> CONÇUE POUR L’INSTINCT</span><span className="stage-edition">PAIKON PLUS — CONCEPT 01</span></div>

        <div className={`visual-wrap phase-${current}`} style={{ opacity: 1 - gameFade }}>
          {!ready && <img className="canvas-fallback" src="/images/hero-off.webp" alt="Manette Paikon Plus, coque noire translucide" />}
          <canvas ref={canvas} className={ready ? 'product-canvas is-ready' : 'product-canvas'} aria-label={`Paikon Plus — ${chapters[current].name}, progression ${Math.round(p * 100)} %`}>Présentation de la manette Paikon Plus contrôlée par le scroll.</canvas>
          <div className="canvas-shade" />
        </div>

        <div className="chapter-copy" style={{ opacity: 1 - gameFade }}>
          {chapters.map((chapter, i) => <div className={`copy-panel ${current === i ? 'is-current' : ''}`} key={chapter.name} aria-hidden={current !== i}>
            <div className="eyebrow"><span className="tiny-cross">+</span>{chapter.eyebrow}</div>
            {i === 0 ? <h1>{chapter.title}</h1> : <h2>{chapter.title}</h2>}
            <p>{chapter.text}</p>
            {i === 0 ? <button className="primary-button" tabIndex={current === 0 ? 0 : -1} onClick={() => goTo(.31)}>Explorer la technologie <ArrowUpRight size={18} /></button> : <div className="chapter-spec"><span />{chapter.detail}</div>}
            {i === 0 && <div className="hero-micro"><span className="mini-ring" /> LE CONTRÔLE, RÉINVENTÉ.</div>}
          </div>)}
        </div>

        <div className={`product-annotation annotation-${current}`} style={{ opacity: 1 - gameFade }} aria-hidden="true">
          <span className="annotation-point" /><div><span className="annotation-number">0{current + 1} / DÉTAIL PRODUIT</span><strong>{chapters[current].label}</strong><span>{current === 0 ? 'La précision, sans contact.' : current === 1 ? 'La lumière à travers la matière.' : current === 2 ? 'Chaque composant compte.' : 'Une extension de votre instinct.'}</span></div>
        </div>

        {current === 2 && <div className="engineering-tags" style={{ opacity: 1 - gameFade }}><span>01 — CAPTEURS HALL</span><span>02 — MOTEURS HAPTIQUES</span><span>03 — RÉSISTANCE ADAPTATIVE</span></div>}

        <div className="game-screen" style={{ opacity: gameFade, pointerEvents: gameFade === 1 ? 'auto' : 'none' }} aria-hidden={gameFade < 1}>
          <div className="game-orbit" /><div className="game-mountain mountain-one" /><div className="game-mountain mountain-two" /><div className="game-horizon" />
          <div className="game-content"><span className="eyebrow">L’EXPÉRIENCE NE FAIT QUE COMMENCER</span><h2>BEYOND<span>THE HORIZON</span></h2><p>{gameOpened ? 'Votre prochaine aventure commence ici.' : 'Un nouveau monde. Le même instinct.'}</p><button tabIndex={gameFade === 1 ? 0 : -1} className="game-start" onClick={() => setGameOpened(!gameOpened)}>{gameOpened ? 'Retour à l’accueil' : 'Entrer dans l’expérience'} <ArrowRight size={16} /></button><span className="game-demo">ÉCRAN DE JEU FICTIF · DÉMONSTRATION VISUELLE</span></div>
        </div>

        <div className="stage-bottom">
          <div className="scroll-hint"><div className="scroll-icon"><ArrowDown size={16} /></div><span>VOTRE SCROLL.<br /><strong>VOTRE TIMELINE.</strong></span></div>
          <div className="chapter-timeline" aria-label="Chapitres de la présentation">
            {chapters.map((c, i) => <button key={c.name} onClick={() => goTo(c.start + (i ? .015 : 0))} aria-current={current === i ? 'step' : undefined} className={current === i ? 'timeline-item selected' : 'timeline-item'}><span className="timeline-line"><span style={{ width: `${Math.min(100, Math.max(0, (p - c.start) / (i === 3 ? .1 : .3) * 100))}%` }} /></span><span className="timeline-label"><em>0{i + 1}</em>{c.name}</span></button>)}
          </div>
          <div className="frame-counter"><span>{String(Math.round(p * 100)).padStart(3, '0')}</span><small>/ 100</small><span className="buffer-message">{failed ? 'Réseau indisponible' : buffering && ready ? 'Chargement…' : 'SCROLL TO EXPLORE'}</span></div>
        </div>
      </div>
    </section>

    <section className="intro-strip"><span>PAIKON PLUS</span><p>Moins de distance entre<br />vous et votre jeu.</p><span className="strip-right">L’ESSENTIEL. SANS COMPROMIS.<MoveUpRight size={24} strokeWidth={1} /></span></section>

    <section id="technology" className="technology-section">
      <div className="section-heading"><div><span className="eyebrow"><span className="tiny-cross">+</span> L’AVANTAGE EST DANS LES DÉTAILS</span><h2>L’instinct rencontre<br /><span>l’ingénierie.</span></h2></div><p>Pas d’artifice. Juste les technologies<br />qui font la différence, au bon endroit.</p></div>
      <div className="feature-list">{features.map((feature) => <article className="feature" key={feature.number}><div className="feature-image"><img loading="lazy" src={feature.image} alt={feature.tag === 'JOYSTICKS HALL EFFECT' ? 'Joysticks et boutons éclairés de Paikon Plus' : feature.tag === 'GÂCHETTES ADAPTATIVES' ? 'Vue éclatée des composants internes' : 'Finition de la coque et grips texturés'} style={{ objectPosition: feature.position }} /><span className="image-index">{feature.number} <Plus size={14} /></span></div><div className="feature-text"><feature.icon size={24} strokeWidth={1} /><span className="eyebrow">{feature.tag}</span><h3>{feature.name}</h3><p>{feature.text}</p></div></article>)}</div>
    </section>

    <section id="details" className="details-section"><div className="detail-visual"><img src="/images/rear.webp" alt="Vue arrière : quatre palettes et grips de Paikon Plus" loading="lazy" /><span>FAÇONNÉE POUR VOTRE PRISE EN MAIN.</span></div><div className="detail-copy"><span className="eyebrow"><span className="tiny-cross">+</span> UNE EXTENSION DE VOUS</span><h2>Tout tombe<br /><span>sous le sens.</span></h2><p>La texture sous vos doigts. Les commandes à portée de main. Une forme qui s’efface pour laisser toute la place au jeu.</p><div className="detail-row"><span>01</span><strong>Grips texturés</strong><span>Une prise en main naturelle</span></div><div className="detail-row"><span>02</span><strong>Quatre palettes arrière</strong><span>Votre configuration, votre style</span></div><div className="detail-row"><span>03</span><strong>Coque translucide</strong><span>L’attention portée à chaque détail</span></div></div></section>

    <section className="faq-section"><span className="eyebrow">POUR ALLER PLUS LOIN</span><div className="faq-layout"><h2>Quelques<br /><span>précisions.</span></h2><div className="faq-list">{faqs.map(([q, a], i) => <div className="faq" key={q}><button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} aria-controls={`faq-${i}`}>{q}{openFaq === i ? <Minus size={17} /> : <Plus size={17} />}</button><div id={`faq-${i}`} hidden={openFaq !== i}><p>{a}</p></div></div>)}</div></div></section>

    <section className="closing"><Gamepad2 size={30} strokeWidth={1} /><span className="eyebrow">PAIKON PLUS</span><h2>Ne jouez pas simplement.<br /><span>Prenez le contrôle.</span></h2><button className="primary-button" onClick={() => goTo(0)}>Revivez l’expérience <ArrowUpRight size={18} /></button></section>
    <footer className="footer"><button className="brand" onClick={() => goTo(0)}><Mark /><span>paikon.</span></button><span>© {new Date().getFullYear()} Paikon Plus — Concept de démonstration.</span><a href="#experience" onClick={(e) => { e.preventDefault(); goTo(0); }}>Retour en haut <ChevronRight size={14} /></a></footer>
  </main>;
}