"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Menu, X, Search, ArrowRight, ArrowLeft, Check, Upload, MessageCircle,
  Phone, Mail, MapPin, Sparkles, ChevronRight, ChevronDown,
  CircleDot, Truck, Wrench, Layers, HelpCircle, Plus,
  Printer, Megaphone, PartyPopper, Building2, Shirt, PenTool, SignpostBig, Package,
} from "lucide-react";
import { SITE, BRAND, waLink, emailLink } from "@/data/site";
import { CATEGORIES, SERVICES, templateFor, catName } from "@/data/services";
import { CLIENTS, WORK } from "@/data/showcase";
import { CATALOGUE } from "@/data/catalogue";
import { Wordmark } from "@/components/Logo";
import { ContentProvider, useContent } from "@/lib/contentStore";

function slugify(s: string) {
  return s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Wrapper: receives content from the server page and provides it to the app.
export default function CloneHubApp({ content }: { content?: any }) {
  return (
    <ContentProvider content={content}>
      <CloneHubInner />
    </ContentProvider>
  );
}

function CloneHubInner() {
  const { services: SERVICES } = useContent();
  const [route, setRoute] = useState({ page: "home" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteSeed, setQuoteSeed] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Map between a route object and a URL path.
  const routeToPath = (r) => {
    switch (r.page) {
      case "home": return "/";
      case "services": return r.filter ? `/services/${r.filter}` : "/services";
      case "service": return `/services/item/${slugify(r.service?.name || "")}`;
      case "portfolio": return "/work";
      case "catalogue": return "/catalogue";
      case "contact": return "/contact";
      default: return "/";
    }
  };
  const pathToRoute = (path) => {
    const p = path.replace(/\/+$/, "") || "/";
    if (p === "/" || p === "") return { page: "home" };
    if (p === "/services") return { page: "services" };
    if (p.startsWith("/services/item/")) {
      const slug = p.replace("/services/item/", "");
      const svc = SERVICES.find((s) => slugify(s.name) === slug);
      return svc ? { page: "service", service: svc } : { page: "services" };
    }
    if (p.startsWith("/services/")) return { page: "services", filter: p.replace("/services/", "") };
    if (p === "/work") return { page: "portfolio" };
    if (p === "/catalogue") return { page: "catalogue" };
    if (p === "/contact") return { page: "contact" };
    return { page: "home" };
  };

  // On first load, adopt the URL. On back/forward, update state.
  useEffect(() => {
    setRoute(pathToRoute(window.location.pathname));
    const onPop = () => setRoute(pathToRoute(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (route) window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  const openQuote = (seed = null) => { setQuoteSeed(seed); setQuoteOpen(true); };
  const go = (page, extra = {}) => {
    const r = { page, ...extra };
    setRoute(r);
    setMenuOpen(false);
    const path = routeToPath(r);
    if (typeof window !== "undefined" && window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
  };

  return (
    <div style={{ background: "#fff", color: BRAND.ink, minHeight: "100vh",
      fontFamily: "var(--body)" }}>
      <GlobalStyle />
      <Header go={go} route={route} openQuote={openQuote}
        menuOpen={menuOpen} setMenuOpen={setMenuOpen}
        openSearch={() => setSearchOpen(true)} />

      {route.page === "home" && <Home go={go} openQuote={openQuote} />}
      {route.page === "services" && <ServicesPage go={go} openQuote={openQuote} filter={route.filter} />}
      {route.page === "service" && <ServiceDetail service={route.service} go={go} openQuote={openQuote} />}
      {route.page === "portfolio" && <PortfolioPage openQuote={openQuote} />}
      {route.page === "catalogue" && <CataloguePage openQuote={openQuote} go={go} />}
      {route.page === "contact" && <ContactPage openQuote={openQuote} />}

      <Footer go={go} openQuote={openQuote} />
      <FloatingBar openQuote={openQuote} />

      {searchOpen && <SearchModal close={() => setSearchOpen(false)} go={go} />}
      {quoteOpen && <QuoteModal close={() => setQuoteOpen(false)} seed={quoteSeed} />}
    </div>
  );
}

/* ============================================================
   HEADER + MEGA MENU
   ============================================================ */
function Header({ go, route, openQuote, menuOpen, setMenuOpen, openSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", h); h();
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: scrolled ? "rgba(255,255,255,.92)" : "#fff",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: `1px solid ${scrolled ? BRAND.line : "transparent"}`,
      transition: "all .3s",
    }}>
      <div className="wrap header-bar" style={{ display: "flex", alignItems: "center",
        justifyContent: "space-between" }}>
        <button onClick={() => go("home")} style={btnReset}>
          <Wordmark size={30} />
        </button>

        <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}
            style={{ position: "relative" }}>
            <NavBtn active={route.page === "services"}>
              Services <ChevronDown size={15} style={{ marginLeft: 2 }} />
            </NavBtn>
            {mega && <MegaMenu go={go} close={() => setMega(false)} />}
          </div>
          <NavBtn onClick={() => go("portfolio")} active={route.page === "portfolio"}>Work</NavBtn>
          <NavBtn onClick={() => go("catalogue")} active={route.page === "catalogue"}>Catalogue</NavBtn>
          <NavBtn onClick={() => go("contact")} active={route.page === "contact"}>Contact</NavBtn>
          <button onClick={openSearch} aria-label="Search services" style={{
            ...btnReset, padding: 9, borderRadius: 10, marginLeft: 4,
            display: "grid", placeItems: "center",
          }}><Search size={18} color={BRAND.slate} /></button>
          <a href={waLink()} target="_blank" rel="noreferrer" className="wa-btn"
            style={{ ...ghostBtn, marginLeft: 6, textDecoration: "none" }}>
            <MessageCircle size={16} /> WhatsApp
          </a>
          <button onClick={() => openQuote()} style={{ ...primaryBtn, marginLeft: 6 }}>
            Get a Quote
          </button>
        </nav>

        <button className="mobile-only" onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu" style={{ ...btnReset, padding: 8 }}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && <MobileMenu go={go} openQuote={openQuote} openSearch={openSearch} />}
    </header>
  );
}

function NavBtn({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      ...btnReset, padding: "10px 14px", borderRadius: 10, fontWeight: 600,
      fontSize: 15, color: active ? BRAND.navy : BRAND.slate,
      display: "flex", alignItems: "center",
    }}>{children}</button>
  );
}

function MegaMenu({ go, close }) {
  return (
    <div style={{
      position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
      width: 720, background: "#fff", borderRadius: 18, padding: 22,
      boxShadow: "0 30px 70px rgba(15,23,42,.18)", border: `1px solid ${BRAND.line}`,
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6,
    }}>
      {CATEGORIES.map((c) => {
        const Icon = c.icon;
        const count = SERVICES.filter((s) => s.category === c.id).length;
        return (
          <button key={c.id} onClick={() => { go("services", { filter: c.id }); close(); }}
            className="mega-item" style={{
              ...btnReset, display: "flex", gap: 12, alignItems: "center",
              padding: "12px 14px", borderRadius: 12, textAlign: "left",
            }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: BRAND.mist, display: "grid", placeItems: "center" }}>
              <Icon size={20} color={BRAND.blue} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
              <div style={{ fontSize: 12.5, color: BRAND.slate }}>{count} services</div>
            </div>
          </button>
        );
      })}
      <button onClick={() => { go("services"); close(); }} className="mega-item"
        style={{ ...btnReset, gridColumn: "1 / -1", marginTop: 4, padding: "12px 14px",
          borderRadius: 12, display: "flex", justifyContent: "space-between",
          alignItems: "center", background: BRAND.navy, color: "#fff", fontWeight: 700 }}>
        View all services <ArrowRight size={18} />
      </button>
    </div>
  );
}

function MobileMenu({ go, openQuote, openSearch }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="mobile-only" style={{ borderTop: `1px solid ${BRAND.line}`,
      padding: "12px 20px 24px", background: "#fff" }}>
      <button onClick={() => { openSearch(); }} style={{
        ...btnReset, width: "100%", display: "flex", gap: 10, alignItems: "center",
        padding: 14, borderRadius: 12, background: BRAND.mist, marginBottom: 8,
        color: BRAND.slate, fontWeight: 600 }}>
        <Search size={18} /> Search services…
      </button>
      <button onClick={() => setOpen(open === "svc" ? null : "svc")} style={mobileRow}>
        Services <ChevronDown size={18} style={{ transform: open === "svc" ? "rotate(180deg)" : "none", transition: ".2s" }} />
      </button>
      {open === "svc" && (
        <div style={{ paddingLeft: 8, marginBottom: 6 }}>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => go("services", { filter: c.id })}
              style={{ ...mobileRow, fontSize: 15, color: BRAND.slate, padding: "11px 8px" }}>
              {c.name} <ChevronRight size={16} />
            </button>
          ))}
        </div>
      )}
      <button onClick={() => go("portfolio")} style={mobileRow}>Work</button>
      <button onClick={() => go("catalogue")} style={mobileRow}>Catalogue</button>
      <button onClick={() => go("contact")} style={mobileRow}>Contact</button>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <a href={waLink()} target="_blank" rel="noreferrer"
          style={{ ...ghostBtn, flex: 1, justifyContent: "center", textDecoration: "none" }}>
          <MessageCircle size={16} /> WhatsApp
        </a>
        <button onClick={() => openQuote()} style={{ ...primaryBtn, flex: 1 }}>Get a Quote</button>
      </div>
    </div>
  );
}

/* ============================================================
   HOME
   ============================================================ */
function Home({ go, openQuote }) {
  return (
    <main>
      <Hero go={go} openQuote={openQuote} />
      <TrustStrip />
      <ServiceCategories go={go} />
      <SelectedWork go={go} />
      <Clients />
      <IdeaToInstall />
      <NotSure openQuote={openQuote} />
      <WhyCloneHub />
      <QuoteCTA openQuote={openQuote} />
      <FAQ />
    </main>
  );
}

function Hero({ go, openQuote }) {
  const { site: SITE } = useContent();
  const headline = SITE.heroHeadline || "Print. Brand.";
  const accent = SITE.heroHeadlineAccent || "Create.";
  const subtext = SITE.heroSubtext ||
    "From business cards and brochures to billboards, event branding, signage, packaging and complete installations — Clone Hub brings ideas to life.";
  const heroImg = SITE.heroImageUrl || "/hero.jpg";
  return (
    <section style={{ position: "relative", overflow: "hidden",
      background: `linear-gradient(160deg, ${BRAND.ink} 0%, #131f52 55%, ${BRAND.navy} 100%)`,
      color: "#fff" }}>
      {/* ambient shapes */}
      <div aria-hidden style={{ position: "absolute", top: -140, right: -120, width: 520, height: 520,
        borderRadius: "50%", border: `40px solid rgba(91,184,232,.10)` }} />
      <div aria-hidden style={{ position: "absolute", bottom: -180, left: -100, width: 420, height: 420,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(46,107,230,.35), transparent 70%)" }} />

      <div className="wrap hero-grid" style={{ position: "relative", paddingTop: 72, paddingBottom: 84 }}>
        <div className="hero-copy">
          <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 14px", borderRadius: 999, background: "rgba(91,184,232,.14)",
            border: "1px solid rgba(91,184,232,.3)", fontSize: 13, fontWeight: 600,
            color: BRAND.sky, marginBottom: 22 }}>
            <CircleDot size={14} /> Nairobi · Design · Print · Branding · Installation
          </div>
          <h1 className="reveal d1" style={{ fontFamily: "var(--display)",
            fontWeight: 800, fontSize: "clamp(42px, 7vw, 84px)", lineHeight: .96,
            letterSpacing: "-2px", margin: 0 }}>
            {headline}<br />
            <span style={{ color: BRAND.sky }}>{accent}</span>
          </h1>
          <p className="reveal d2" style={{ fontSize: "clamp(16px,2.2vw,20px)", lineHeight: 1.55,
            color: "rgba(255,255,255,.78)", maxWidth: 540, margin: "22px 0 34px" }}>
            {subtext}
          </p>
          <div className="reveal d3" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => openQuote()} style={{ ...primaryBtn, padding: "15px 26px", fontSize: 16 }}>
              Get a Quote <ArrowRight size={18} />
            </button>
            <a href={waLink()} target="_blank" rel="noreferrer"
              style={{ ...lightBtn, textDecoration: "none", padding: "15px 24px", fontSize: 16 }}>
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>
          <div className="reveal d4" style={{ display: "flex", gap: 26, marginTop: 40, flexWrap: "wrap" }}>
            {[["Design", "in-house studio"], ["Production", "small to large-scale"], ["Installation", "delivered & set up"]]
              .map(([a, b]) => (
                <div key={a}>
                  <div style={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>{a}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>{b}</div>
                </div>
              ))}
          </div>
        </div>

        {/* Hero visual — real Clone Hub branded stationery */}
        <div className="hero-visual reveal d2">
          <div className="hero-photo-wrap">
            <img src={heroImg} alt="Clone Hub branded stationery — bag, notebook, business cards, mug and pen"
              className="hero-photo" loading="eager" />
            <div className="hero-photo-badge">
              <img src="/mark.png" alt="" style={{ width: 30, height: "auto" }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: BRAND.ink }}>Full brand kits</div>
                <div style={{ fontSize: 11.5, color: BRAND.slate }}>designed, printed & delivered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    [Layers, "From small runs to large-scale production"],
    [PenTool, "Design + Print + Branding + Installation"],
    [Truck, "Delivery, pickup & full event setup"],
    [MessageCircle, "Quote instantly on WhatsApp"],
  ];
  return (
    <section style={{ borderBottom: `1px solid ${BRAND.line}`, background: "#fff" }}>
      <div className="wrap trust-grid" style={{ padding: "26px 0" }}>
        {items.map(([Icon, t], i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: BRAND.mist,
              display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon size={20} color={BRAND.blue} />
            </div>
            <span style={{ fontSize: 14.5, fontWeight: 600, color: BRAND.slate }}>{t}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServiceCategories({ go }) {
  const { services: SERVICES } = useContent();
  return (
    <Section eyebrow="What we do" title="Whatever you need — we handle it"
      sub="Nine production categories under one roof. Tap any to explore, or see the full catalog.">
      <div className="cat-grid">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const count = SERVICES.filter((s) => s.category === c.id).length;
          return (
            <button key={c.id} onClick={() => go("services", { filter: c.id })}
              className="cat-card" style={btnReset}>
              <div className="cat-icon"><Icon size={22} color={BRAND.blue} /></div>
              <div className="cat-text">
                <div className="cat-name">{c.name}</div>
                <div className="cat-count">{count} services</div>
              </div>
              <ArrowRight size={16} className="cat-chevron" />
            </button>
          );
        })}
        <button onClick={() => go("services")} className="cat-card cat-cta" style={btnReset}>
          <div className="cat-icon cta"><Sparkles size={22} color="#fff" /></div>
          <div className="cat-text">
            <div className="cat-name" style={{ color: "#fff" }}>All {SERVICES.length} services</div>
            <div className="cat-count" style={{ color: "rgba(255,255,255,.75)" }}>Browse everything</div>
          </div>
          <ArrowRight size={16} className="cat-chevron" style={{ color: "#fff" }} />
        </button>
      </div>
    </Section>
  );
}

function SelectedWork({ go }) {
  const { work: WORK } = useContent();
  return (
    <section style={{ background: BRAND.mist }}>
      <div className="wrap" style={{ padding: "84px 0" }}>
        <SectionHead eyebrow="Selected work" title="Work that speaks for itself"
          sub="A look at the kind of production Clone Hub delivers — from print to full installations." />
        <div className="work-grid">
          {WORK.slice(0, 5).map((w, i) => (
            <WorkCard key={i} w={w} featured={i === 0} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 34 }}>
          <button onClick={() => go("portfolio")} style={{ ...outlineBtn }}>
            View full portfolio <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

function WorkCard({ w, featured }) {
  return (
    <div className={`work-card ${featured ? "featured" : ""}`}>
      <div className="work-media" style={{
        background: w.image ? "#0B1220" : `linear-gradient(135deg, ${w.tone[0]}, ${w.tone[1]})` }}>
        {w.image
          ? <img src={w.image} alt={w.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <>
              <div className="work-mark"><img src="/mark-white.png" alt="" style={{ width: 54, opacity: .22 }} /></div>
              <span className="work-demo">Demo</span>
            </>}
      </div>
      <div className="work-body">
        <span className="work-cat">{w.cat}</span>
        <div style={{ fontWeight: 700, fontSize: featured ? 22 : 16, marginTop: 6 }}>{w.title}</div>
      </div>
    </div>
  );
}

function Clients() {
  const { clients: CLIENTS } = useContent();
  // Duplicate the list so the marquee loops seamlessly.
  const row = [...CLIENTS, ...CLIENTS];
  return (
    <section className="wrap" style={{ padding: "72px 0" }}>
      <SectionHead eyebrow="Trusted by brands that mean business" title="Brands we've worked with"
        sub="From established corporations to growing businesses, Clone Hub delivers print, branding and production built to make brands stand out." />
      <div className="client-marquee">
        <div className="client-track">
          {row.map((c, i) => (
            <div key={i} className="client-badge" title={c.name}>
              {c.logo
                ? <img src={c.logo} alt={c.name} style={{ maxHeight: 40, maxWidth: 120, objectFit: "contain" }} />
                : <span>{c.name}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IdeaToInstall() {
  const steps = [
    ["Discover", "Tell us what you need.", HelpCircle],
    ["Design", "We create or prepare the artwork.", PenTool],
    ["Produce", "We print and manufacture your materials.", Printer],
    ["Deliver", "We get everything to your location.", Truck],
    ["Install", "Our team sets everything up where required.", Wrench],
    ["Complete", "You get a finished, professional result.", Check],
  ];
  return (
    <section style={{ background: BRAND.ink, color: "#fff" }}>
      <div className="wrap" style={{ padding: "88px 0" }}>
        <SectionHead light eyebrow="From idea to installation"
          title="One partner, end to end"
          sub="Most printers stop at the print. We take a project from the first brief all the way to event-day setup." />
        <div className="process-grid">
          {steps.map(([t, d, Icon], i) => (
            <div key={t} className="process-step">
              <div className="process-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="process-icon"><Icon size={22} color={BRAND.sky} /></div>
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 12 }}>{t}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.62)", marginTop: 6 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NotSure({ openQuote }) {
  return (
    <section className="wrap" style={{ padding: "72px 0" }}>
      <div className="notsure">
        <div style={{ maxWidth: 560 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px",
            borderRadius: 999, background: "rgba(46,107,230,.1)", color: BRAND.blue,
            fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
            <HelpCircle size={15} /> Not sure what to order?
          </div>
          <h3 style={{ fontFamily: "var(--display)", fontWeight: 800,
            fontSize: "clamp(26px,4vw,38px)", lineHeight: 1.05, letterSpacing: "-1px", margin: 0 }}>
            Tell us what you're trying to achieve.
          </h3>
          <p style={{ color: BRAND.slate, fontSize: 17, marginTop: 14, lineHeight: 1.5 }}>
            You don't need to know the technical printing terms. Describe the goal and
            we'll recommend the right solution, materials and finishing.
          </p>
        </div>
        <button onClick={() => openQuote({ mode: "consult" })}
          style={{ ...primaryBtn, padding: "16px 28px", fontSize: 16, flexShrink: 0 }}>
          Get a recommendation <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

function WhyCloneHub() {
  const points = [
    ["Built for businesses, events & brands", "Corporate offices, SMEs, schools, churches, restaurants, NGOs and event organisers across Nairobi."],
    ["From small runs to large-scale", "A hundred flyers or a highway billboard — the same standard of finish."],
    ["Design + print + install", "Bring artwork or let our studio create it. We produce, deliver and install."],
    ["Quote your way", "Configure specs online, send on WhatsApp, or email your brief. Whatever's fastest for you."],
  ];
  return (
    <section style={{ background: BRAND.mist }}>
      <div className="wrap why-grid" style={{ padding: "84px 0" }}>
        <div>
          <SectionHead eyebrow="Why Clone Hub"
            title="Built for brands that want to stand out" align="left" />
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {points.map(([t, d]) => (
            <div key={t} className="why-card">
              <div className="why-check"><Check size={16} color="#fff" strokeWidth={3} /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{t}</div>
                <div style={{ color: BRAND.slate, fontSize: 14.5, marginTop: 4, lineHeight: 1.5 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteCTA({ openQuote }) {
  return (
    <section className="wrap" style={{ padding: "80px 0" }}>
      <div className="cta-band">
        <div aria-hidden className="cta-glow" />
        <h3 style={{ fontFamily: "var(--display)", fontWeight: 800,
          fontSize: "clamp(30px,5vw,52px)", letterSpacing: "-1.5px", lineHeight: 1, margin: 0,
          color: "#fff", position: "relative" }}>
          Have a project in mind?<br />
          <span style={{ color: BRAND.sky }}>Let's bring it to life.</span>
        </h3>
        <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap",
          justifyContent: "center", position: "relative" }}>
          <button onClick={() => openQuote()} style={{ ...primaryBtn, padding: "16px 30px", fontSize: 16 }}>
            Get a Quote <ArrowRight size={18} />
          </button>
          <a href={waLink()} target="_blank" rel="noreferrer"
            style={{ ...lightBtn, textDecoration: "none", padding: "16px 28px", fontSize: 16 }}>
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    ["Do you design artwork?", "Yes. Our studio can create everything from scratch, or refine and prepare artwork you already have. You can also send print-ready files directly."],
    ["Can I bring my own design?", "Absolutely. Upload your artwork with your quote request. If it needs adjustments for print, we'll let you know."],
    ["Can I order small quantities?", "Yes — from short runs to large-scale production. Availability and turnaround depend on the project specifications."],
    ["Can you handle complete event branding?", "Yes. We cover design, print, delivery, on-site installation, event-day setup and dismantling as a single project."],
    ["Do you deliver and install?", "We offer pickup, delivery, and delivery with installation. Large-format and event work can include full setup and dismantling."],
    ["Can I request a quotation through WhatsApp?", "Yes. Build your request on the site and send it as a structured WhatsApp message, or email your brief — whichever is easier."],
    ["How long does printing take?", "Turnaround depends on the item, quantity and finishing. Share your deadline in the quote and we'll confirm what's possible."],
    ["Can you help me choose materials?", "Yes. If you're unsure, use \"Not sure what to order\" and describe the goal — we'll recommend materials and finishing."],
  ];
  const [open, setOpen] = useState(0);
  return (
    <Section eyebrow="FAQ" title="Questions, answered"
      sub="Anything specific to your project, just ask on WhatsApp.">
      <div style={{ maxWidth: 780, margin: "0 auto", display: "grid", gap: 10 }}>
        {faqs.map(([q, a], i) => (
          <div key={i} className="faq-item">
            <button onClick={() => setOpen(open === i ? -1 : i)} style={{
              ...btnReset, width: "100%", display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "18px 20px", textAlign: "left" }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>{q}</span>
              <Plus size={18} color={BRAND.blue} style={{
                transform: open === i ? "rotate(45deg)" : "none", transition: ".2s", flexShrink: 0 }} />
            </button>
            {open === i && (
              <div style={{ padding: "0 20px 20px", color: BRAND.slate, fontSize: 15, lineHeight: 1.6 }}>{a}</div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ============================================================
   SERVICES PAGE
   ============================================================ */
function ServicesPage({ go, openQuote, filter }) {
  const { services: SERVICES } = useContent();
  const [active, setActive] = useState(filter || "all");
  const [q, setQ] = useState("");
  useEffect(() => { setActive(filter || "all"); }, [filter]);

  const list = useMemo(() => {
    return SERVICES.filter((s) => {
      const catOk = active === "all" || s.category === active;
      const qOk = !q || s.name.toLowerCase().includes(q.toLowerCase());
      return catOk && qOk;
    });
  }, [active, q]);

  return (
    <main>
      <PageHeader title="Services" crumb="Everything we can print, brand, design & install"
        sub={`Browse ${SERVICES.length} services across ${CATEGORIES.length} categories. Every service is quotation-driven — request yours in a couple of taps.`} />
      <div className="wrap" style={{ padding: "0 0 90px" }}>
        <div className="svc-search">
          <Search size={18} color={BRAND.slate} />
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search: banner, wedding, vehicle, brochure…"
            style={{ border: "none", outline: "none", flex: 1, fontSize: 16, background: "transparent" }} />
          {q && <button onClick={() => setQ("")} style={btnReset}><X size={18} color={BRAND.slate} /></button>}
        </div>

        <div className="chip-row">
          <Chip active={active === "all"} onClick={() => setActive("all")}>
            All <span className="chip-count">{SERVICES.length}</span>
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={active === c.id} onClick={() => setActive(c.id)}>
              {c.name}
              <span className="chip-count">{SERVICES.filter((s) => s.category === c.id).length}</span>
            </Chip>
          ))}
        </div>

        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: BRAND.slate }}>
            No services match "{q}". Try another term — or{" "}
            <button onClick={() => openQuote({ mode: "consult" })} style={{
              ...btnReset, color: BRAND.blue, fontWeight: 700, textDecoration: "underline" }}>
              tell us what you need</button>.
          </div>
        ) : (
          <div className="svc-grid">
            {list.map((s) => (
              <div key={s.name} className="svc-card">
                <div style={{ flex: 1 }}>
                  <span className="svc-tag">{CATEGORIES.find((c) => c.id === s.category)?.name}</span>
                  <div style={{ fontWeight: 700, fontSize: 17, marginTop: 10 }}>{s.name}</div>
                  <div style={{ fontSize: 14, color: BRAND.slate, marginTop: 6, lineHeight: 1.5 }}>{s.blurb}</div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <button onClick={() => go("service", { service: s })} style={{ ...tinyBtn }}>
                    Details
                  </button>
                  <button onClick={() => openQuote({ service: s.name, category: s.category })}
                    style={{ ...tinyPrimary }}>
                    Request Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Chip({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      ...btnReset, padding: "9px 16px", borderRadius: 999, fontWeight: 600, fontSize: 14,
      display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
      background: active ? BRAND.navy : "#fff", color: active ? "#fff" : BRAND.slate,
      border: `1px solid ${active ? BRAND.navy : BRAND.line}`, transition: ".15s",
    }}>{children}</button>
  );
}

/* ============================================================
   SERVICE DETAIL
   ============================================================ */
function ServiceDetail({ service, go, openQuote }) {
  const { services: SERVICES } = useContent();
  if (!service) { go("services"); return null; }
  const cat = CATEGORIES.find((c) => c.id === service.category);
  const related = SERVICES.filter((s) => s.category === service.category && s.name !== service.name).slice(0, 4);
  const specs = {
    printing: ["Sizes: A6 up to A0 and custom", "Stock: 130–400gsm, art & bond papers", "Sides: single or double", "Runs: short to bulk"],
    "large-format": ["Any width and height", "PVC, mesh, vinyl, fabric", "Eyelets & reinforced edges", "Installation available"],
    events: ["Full stage & backdrop dressing", "Modular exhibition builds", "On-site setup & dismantling", "Delivery included"],
    corporate: ["Consistent brand application", "Interior & exterior branding", "Stationery systems", "Bulk staff items"],
    branding: ["Screen, DTF & embroidery", "Bulk apparel & merchandise", "Sample approvals", "Fast reorders"],
    design: ["Print-ready file setup", "Brand systems & guidelines", "Revisions included", "Source files on request"],
    signage: ["Acrylic, metal, PVC, LED", "Illuminated options", "Wall & storefront mounting", "Site survey available"],
    packaging: ["Custom die-cut shapes", "Food-safe materials", "Short & long runs", "Structural + print design"],
  }[service.category] || [];

  const finishing = ["Matte", "Gloss", "Lamination", "Soft Touch", "Spot UV", "Foiling", "Embossing", "Die Cutting", "Binding", "Eyelets"];

  return (
    <main>
      <section style={{ background: `linear-gradient(150deg, ${BRAND.ink}, ${BRAND.navy})`, color: "#fff" }}>
        <div className="wrap" style={{ padding: "56px 0 60px" }}>
          <button onClick={() => go("services", { filter: service.category })}
            style={{ ...btnReset, color: "rgba(255,255,255,.6)", fontSize: 14, display: "flex",
              alignItems: "center", gap: 6, marginBottom: 22 }}>
            <ArrowLeft size={15} /> {cat?.name}
          </button>
          <div className="detail-grid">
            <div>
              <h1 style={{ fontFamily: "var(--display)", fontWeight: 800,
                fontSize: "clamp(34px,5.5vw,58px)", letterSpacing: "-1.5px", lineHeight: 1, margin: 0 }}>
                {service.name}
              </h1>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,.78)", marginTop: 18, maxWidth: 520, lineHeight: 1.55 }}>
                {service.blurb} Every order is quoted to your exact specification — you'll never
                pay for more than you need.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
                <button onClick={() => openQuote({ service: service.name, category: service.category })}
                  style={{ ...primaryBtn, padding: "15px 26px", fontSize: 16 }}>
                  Request a Quote <ArrowRight size={18} />
                </button>
                <a href={waLink(`Hello Clone Hub, I'd like a quote for ${service.name}.`)}
                  target="_blank" rel="noreferrer"
                  style={{ ...lightBtn, textDecoration: "none", padding: "15px 24px", fontSize: 16 }}>
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </div>
            </div>
            <div className="detail-visual" style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.sky})` }}>
              <img src="/mark-white.png" alt="" style={{ width: 80, opacity: .25 }} />
            </div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ padding: "64px 0 90px" }}>
        <div className="detail-cols">
          <Block title="Specifications">
            <ul className="tick-list">
              {specs.map((s) => <li key={s}><Check size={15} color={BRAND.blue} /> {s}</li>)}
            </ul>
          </Block>
          <Block title="Finishing options">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {finishing.map((f) => <span key={f} className="finish-pill">{f}</span>)}
            </div>
            <p style={{ fontSize: 13, color: BRAND.slate, marginTop: 14 }}>
              Available finishing depends on the item — confirm options in your quote.
            </p>
          </Block>
          <Block title="How you receive it">
            <ul className="tick-list">
              <li><Truck size={15} color={BRAND.blue} /> Pickup from our Nairobi workshop</li>
              <li><Truck size={15} color={BRAND.blue} /> Delivery to your location</li>
              <li><Wrench size={15} color={BRAND.blue} /> Delivery + installation</li>
              <li><PartyPopper size={15} color={BRAND.blue} /> Full event setup & dismantling</li>
            </ul>
          </Block>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <h3 style={{ fontWeight: 800, fontSize: 22, marginBottom: 18 }}>Related services</h3>
            <div className="svc-grid">
              {related.map((s) => (
                <div key={s.name} className="svc-card">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{s.name}</div>
                    <div style={{ fontSize: 13.5, color: BRAND.slate, marginTop: 6 }}>{s.blurb}</div>
                  </div>
                  <button onClick={() => go("service", { service: s })}
                    style={{ ...tinyBtn, marginTop: 14 }}>View</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Block({ title, children }) {
  return (
    <div className="detail-block">
      <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14 }}>{title}</h3>
      {children}
    </div>
  );
}

/* ============================================================
   PORTFOLIO PAGE
   ============================================================ */
function PortfolioPage({ openQuote }) {
  const cats = ["All", ...Array.from(new Set(WORK.map((w) => w.cat)))];
  const [f, setF] = useState("All");
  const [light, setLight] = useState(null);
  const list = f === "All" ? WORK : WORK.filter((w) => w.cat === f);
  return (
    <main>
      <PageHeader title="Selected work" crumb="Made by Clone Hub"
        sub="A visual look at the breadth of our production. Real project images slot straight into this gallery — the tiles below are clearly-marked demos." />
      <div className="wrap" style={{ padding: "0 0 90px" }}>
        <div className="chip-row">
          {cats.map((c) => (
            <Chip key={c} active={f === c} onClick={() => setF(c)}>{c}</Chip>
          ))}
        </div>
        <div className="masonry">
          {list.map((w, i) => (
            <button key={i} onClick={() => setLight(w)} className="masonry-item" style={btnReset}>
              {w.image
                ? <div className="masonry-media has-img">
                    <img src={w.image} alt={w.title} loading="lazy" />
                    <div className="masonry-overlay">
                      <span className="work-cat" style={{ background: "rgba(255,255,255,.9)" }}>{w.cat}</span>
                      <div style={{ fontWeight: 700, color: "#fff", marginTop: 8 }}>{w.title}</div>
                    </div>
                  </div>
                : <div className="masonry-media" style={{
                    background: `linear-gradient(135deg, ${w.tone[0]}, ${w.tone[1]})`,
                    paddingTop: i % 3 === 0 ? "125%" : i % 3 === 1 ? "80%" : "100%" }}>
                    <img src="/mark-white.png" alt="" style={{ width: 48, opacity: .22 }} />
                    <span className="work-demo">Demo</span>
                    <div className="masonry-overlay">
                      <span className="work-cat" style={{ background: "rgba(255,255,255,.9)" }}>{w.cat}</span>
                      <div style={{ fontWeight: 700, color: "#fff", marginTop: 8 }}>{w.title}</div>
                    </div>
                  </div>}
            </button>
          ))}
        </div>

        <div className="port-cta">
          <div>
            <h3 style={{ fontFamily: "var(--display)", fontWeight: 800,
              fontSize: "clamp(24px,4vw,34px)", margin: 0, letterSpacing: "-1px" }}>
              Have a project like this?
            </h3>
            <p style={{ color: BRAND.slate, marginTop: 8, fontSize: 16 }}>Let's create yours.</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => openQuote()} style={primaryBtn}>Get a Quote <ArrowRight size={17} /></button>
            <a href={waLink()} target="_blank" rel="noreferrer" style={{ ...ghostBtn, textDecoration: "none" }}>
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {light && (
        <div className="lightbox" onClick={() => setLight(null)}>
          <button style={{ ...btnReset, position: "absolute", top: 24, right: 24, color: "#fff" }}>
            <X size={30} />
          </button>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <div style={{ background: light.image ? "#000" : `linear-gradient(135deg, ${light.tone[0]}, ${light.tone[1]})`,
              borderRadius: 18, aspectRatio: "4/3", display: "grid", placeItems: "center", overflow: "hidden" }}>
              {light.image
                ? <img src={light.image} alt={light.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                : <img src="/mark-white.png" alt="" style={{ width: 90, opacity: .25 }} />}
            </div>
            <div style={{ color: "#fff", marginTop: 18, textAlign: "center" }}>
              <span className="work-cat">{light.cat}</span>
              <div style={{ fontWeight: 700, fontSize: 22, marginTop: 8 }}>{light.title}</div>
              {!light.image && (
                <div style={{ color: "rgba(255,255,255,.55)", fontSize: 13, marginTop: 4 }}>
                  Demo placeholder — real project image goes here
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ============================================================
   CONTACT PAGE
   ============================================================ */
/* ============================================================
   CATALOGUE PAGE
   ============================================================ */
function CataloguePage({ openQuote, go }) {
  const { catalogue: CATALOGUE } = useContent();
  return (
    <main>
      <PageHeader title="Our Catalogue" crumb="Everything Clone Hub produces"
        sub="A complete look at our print, branding and production capabilities — organized by service. See something you need? Request a quote in a couple of taps." />

      {/* quick jump nav */}
      <div className="wrap" style={{ paddingTop: 8 }}>
        <div className="cat-jump">
          {CATALOGUE.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="cat-jump-chip">{s.title}</a>
          ))}
        </div>
      </div>

      <div className="wrap" style={{ padding: "36px 0 90px" }}>
        {CATALOGUE.map((s, i) => (
          <section key={s.id} id={s.id} className="cat-section"
            style={{ direction: i % 2 ? "rtl" : "ltr" }}>
            <div className="cat-sec-media" style={{ direction: "ltr" }}>
              <img src={s.image} alt={s.imageAlt} loading="lazy" />
              <span className="cat-sec-index">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="cat-sec-body" style={{ direction: "ltr" }}>
              <div className="cat-sec-eyebrow">{`Section ${String(i + 1).padStart(2, "0")}`}</div>
              <h2 className="cat-sec-title">{s.title}</h2>
              <p className="cat-sec-intro">{s.intro}</p>
              <div className="cat-sec-items">
                {s.items.map((it) => (
                  <span key={it} className="cat-sec-item"><Check size={13} color={BRAND.blue} /> {it}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
                <button onClick={() => openQuote()} style={{ ...primaryBtn, padding: "12px 20px" }}>
                  Request a Quote <ArrowRight size={16} />
                </button>
                <a href={waLink(`Hello Clone Hub, I'd like a quote for ${s.title}.`)} target="_blank" rel="noreferrer"
                  style={{ ...ghostBtn, textDecoration: "none", padding: "11px 18px" }}>
                  <MessageCircle size={15} /> WhatsApp
                </a>
              </div>
            </div>
          </section>
        ))}

        {/* closing CTA */}
        <div className="cta-band" style={{ marginTop: 20 }}>
          <div aria-hidden className="cta-glow" />
          <h3 style={{ fontFamily: "var(--display)", fontWeight: 800,
            fontSize: "clamp(26px,4.5vw,44px)", letterSpacing: "-1px", lineHeight: 1.05, margin: 0,
            color: "#fff", position: "relative" }}>
            Don't see exactly what you need?<br />
            <span style={{ color: BRAND.sky }}>Tell us — we'll handle it.</span>
          </h3>
          <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap",
            justifyContent: "center", position: "relative" }}>
            <button onClick={() => openQuote({ mode: "consult" })} style={{ ...primaryBtn, padding: "15px 26px", fontSize: 16 }}>
              Get a recommendation <ArrowRight size={18} />
            </button>
            <a href={waLink()} target="_blank" rel="noreferrer"
              style={{ ...lightBtn, textDecoration: "none", padding: "15px 24px", fontSize: 16 }}>
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}


function ContactPage({ openQuote }) {
  const { site: SITE } = useContent();
  return (
    <main>
      <PageHeader title="Contact" crumb="Let's talk about your project"
        sub="Reach us on WhatsApp for the fastest response, or send your brief by email." />
      <div className="wrap contact-grid" style={{ padding: "0 0 90px" }}>
        <div style={{ display: "grid", gap: 14 }}>
          <ContactRow icon={MapPin} label="Visit us" value={SITE.address} />
          <ContactRow icon={Phone} label="Call" value={SITE.phone} href={`tel:${SITE.phone.replace(/\s/g, "")}`} />
          <ContactRow icon={Phone} label="Call (alt)" value={SITE.phone2} href={`tel:${SITE.phone2.replace(/\s/g, "")}`} />
          <ContactRow icon={MessageCircle} label="WhatsApp" value={SITE.phone} href={waLink()} accent />
          <ContactRow icon={Mail} label="Email" value={SITE.email} href={`mailto:${SITE.email}`} />
          <div style={{ padding: 18, borderRadius: 14, background: BRAND.mist, fontSize: 14,
            color: BRAND.slate, lineHeight: 1.55 }}>
            <strong style={{ color: BRAND.ink }}>Clone Hub Prints</strong> · Erick Mathenge, Graphic Designer.
            Design, printing, branding and installation for Nairobi businesses, events and brands.
          </div>
        </div>

        <div className="contact-cta">
          <div className="cta-glow" aria-hidden />
          <div style={{ position: "relative" }}>
            <h3 style={{ fontFamily: "var(--display)", fontWeight: 800,
              fontSize: 30, color: "#fff", margin: 0, letterSpacing: "-1px", lineHeight: 1.05 }}>
              Send us your brief.
            </h3>
            <p style={{ color: "rgba(255,255,255,.75)", marginTop: 12, fontSize: 16, lineHeight: 1.5 }}>
              Build a structured quote request in a few taps — then send it straight to us on
              WhatsApp or by email with your artwork attached.
            </p>
            <button onClick={() => openQuote()} style={{ ...primaryBtn, marginTop: 24,
              padding: "15px 26px", fontSize: 16 }}>
              Start a Quote Request <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function ContactRow({ icon: Icon, label, value, href, accent }) {
  const inner = (
    <div className="contact-row" style={{ borderColor: accent ? BRAND.blue : BRAND.line }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0,
        background: accent ? BRAND.blue : BRAND.mist, display: "grid", placeItems: "center" }}>
        <Icon size={22} color={accent ? "#fff" : BRAND.blue} />
      </div>
      <div>
        <div style={{ fontSize: 12.5, color: BRAND.slate, fontWeight: 600, textTransform: "uppercase",
          letterSpacing: ".5px" }}>{label}</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>{value}</div>
      </div>
      {href && <ArrowRight size={18} color={BRAND.slate} style={{ marginLeft: "auto" }} />}
    </div>
  );
  return href
    ? <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit" }}>{inner}</a>
    : inner;
}

/* ============================================================
   SMART QUOTE MODAL (multi-step)
   ============================================================ */
function QuoteModal({ close, seed }) {
  const consult = seed?.mode === "consult";
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    service: seed?.service || "",
    category: seed?.category || "",
    // specs
    quantity: "", dimW: "", dimH: "", sides: "", material: "", finish: "",
    eventType: "", eventDate: "", venue: "", eyelets: "",
    // consult
    goal: "", useFor: "", howMany: "", whenNeeded: "", whereUsed: "",
    // artwork
    design: "", files: [],
    // fulfillment
    fulfillment: "", location: "", deadline: "", installNotes: "",
    // event package
    eventItems: [],
    // details
    name: "", phone: "", email: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const isEvent = data.category === "events";
  const steps = consult
    ? ["What you need", "Details", "Delivery", "Your details", "Review"]
    : ["Service", "Specifications", "Artwork", "Delivery", "Your details", "Review"];

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canProceed = () => {
    if (consult) {
      if (step === 0) return data.goal.trim().length > 2;
      if (step === 3) return data.name && (data.phone || data.email);
      return true;
    }
    if (step === 0) return !!data.service;
    if (step === 4) return data.name && (data.phone || data.email);
    return true;
  };

  const message = buildMessage(data, consult);

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div className="modal-head">
          <div>
            <div style={{ fontSize: 12.5, color: BRAND.sky, fontWeight: 700, letterSpacing: ".5px" }}>
              {consult ? "CONSULTATION" : "QUOTE REQUEST"}
            </div>
            <div style={{ fontWeight: 800, fontSize: 18, marginTop: 2, color: "#fff" }}>
              {submitted ? "Request ready" : steps[step]}
            </div>
          </div>
          <button onClick={close} style={{ ...btnReset, color: "rgba(255,255,255,.7)" }}><X size={24} /></button>
        </div>

        {/* progress */}
        {!submitted && (
          <div className="progress">
            {steps.map((_, i) => (
              <div key={i} className="progress-seg" style={{
                background: i <= step ? BRAND.sky : "rgba(255,255,255,.18)" }} />
            ))}
          </div>
        )}

        {/* body */}
        <div className="modal-body">
          {submitted ? (
            <SuccessScreen message={message} data={data} close={close} />
          ) : (
            <>
              {consult
                ? <ConsultSteps step={step} data={data} set={set} />
                : <QuoteSteps step={step} data={data} set={set} isEvent={isEvent} />}
            </>
          )}
        </div>

        {/* footer */}
        {!submitted && (
          <div className="modal-foot">
            {step > 0
              ? <button onClick={back} style={{ ...outlineBtn, padding: "12px 18px" }}>
                  <ArrowLeft size={16} /> Back</button>
              : <span />}
            {step < steps.length - 1 ? (
              <button onClick={next} disabled={!canProceed()}
                style={{ ...primaryBtn, opacity: canProceed() ? 1 : .45,
                  cursor: canProceed() ? "pointer" : "not-allowed" }}>
                Continue <ArrowRight size={17} />
              </button>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setSubmitted(true)}
                  style={{ ...outlineBtn, padding: "13px 18px" }}>
                  <Mail size={16} /> Email
                </button>
                <a href={waLink(message)} target="_blank" rel="noreferrer"
                  onClick={() => setTimeout(() => setSubmitted(true), 400)}
                  style={{ ...primaryBtn, textDecoration: "none", background: "#25D366" }}>
                  <MessageCircle size={17} /> Send on WhatsApp
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuoteSteps({ step, data, set, isEvent }) {
  if (step === 0) return <StepService data={data} set={set} />;
  if (step === 1) return isEvent
    ? <StepEventPackage data={data} set={set} />
    : <StepSpecs data={data} set={set} />;
  if (step === 2) return <StepArtwork data={data} set={set} />;
  if (step === 3) return <StepDelivery data={data} set={set} isEvent={isEvent} />;
  if (step === 4) return <StepDetails data={data} set={set} />;
  return <StepReview data={data} />;
}

function ConsultSteps({ step, data, set }) {
  if (step === 0) return (
    <div style={{ display: "grid", gap: 18 }}>
      <Intro>Tell us what you're trying to achieve — no printing jargon needed. We'll recommend the right solution.</Intro>
      <Field label="What are you trying to produce or achieve?" required>
        <textarea value={data.goal} onChange={(e) => set("goal", e.target.value)} rows={3}
          placeholder="e.g. I'm launching a product and need everything to look professional at the event…"
          style={inputStyle} />
      </Field>
      <Field label="What's it for?">
        <input value={data.useFor} onChange={(e) => set("useFor", e.target.value)}
          placeholder="Product launch, office, wedding, shop…" style={inputStyle} />
      </Field>
    </div>
  );
  if (step === 1) return (
    <div style={{ display: "grid", gap: 18 }}>
      <div className="two-col">
        <Field label="How many do you need?">
          <input value={data.howMany} onChange={(e) => set("howMany", e.target.value)}
            placeholder="Rough estimate is fine" style={inputStyle} />
        </Field>
        <Field label="When do you need it?">
          <input type="date" value={data.whenNeeded} onChange={(e) => set("whenNeeded", e.target.value)} style={inputStyle} />
        </Field>
      </div>
      <Field label="Where will it be used?">
        <input value={data.whereUsed} onChange={(e) => set("whereUsed", e.target.value)}
          placeholder="Venue, city, indoor/outdoor…" style={inputStyle} />
      </Field>
      <StepArtwork data={data} set={set} embedded />
    </div>
  );
  if (step === 2) return <StepDelivery data={data} set={set} />;
  if (step === 3) return <StepDetails data={data} set={set} />;
  return <StepReview data={data} consult />;
}

function StepService({ data, set }) {
  const { services: SERVICES } = useContent();
  const [q, setQ] = useState("");
  const filtered = SERVICES.filter((s) => !q || s.name.toLowerCase().includes(q.toLowerCase())).slice(0, 40);
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Intro>What do you need? Pick a service — the form adapts to what you choose.</Intro>
      <div className="svc-search" style={{ marginTop: 0 }}>
        <Search size={18} color={BRAND.slate} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services…"
          style={{ border: "none", outline: "none", flex: 1, fontSize: 15, background: "transparent" }} />
      </div>
      <div className="pick-grid">
        {filtered.map((s) => (
          <button key={s.name} onClick={() => { set("service", s.name); set("category", s.category); }}
            style={{ ...btnReset, padding: "12px 14px", borderRadius: 12, textAlign: "left",
              border: `1.5px solid ${data.service === s.name ? BRAND.blue : BRAND.line}`,
              background: data.service === s.name ? "rgba(46,107,230,.06)" : "#fff",
              fontWeight: 600, fontSize: 14.5,
              display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {s.name}
            {data.service === s.name && <Check size={16} color={BRAND.blue} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepSpecs({ data, set }) {
  const tpl = templateFor(data.category);
  const showDim = tpl.includes("dimensions");
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Intro>Specifications for <strong>{data.service}</strong>. Skip anything you're unsure about — we'll confirm.</Intro>
      {showDim ? (
        <div className="two-col">
          <Field label="Width"><input value={data.dimW} onChange={(e) => set("dimW", e.target.value)}
            placeholder="e.g. 3m / 300cm" style={inputStyle} /></Field>
          <Field label="Height"><input value={data.dimH} onChange={(e) => set("dimH", e.target.value)}
            placeholder="e.g. 1m / 100cm" style={inputStyle} /></Field>
        </div>
      ) : null}
      <div className="two-col">
        <Field label="Quantity"><input value={data.quantity} onChange={(e) => set("quantity", e.target.value)}
          placeholder="e.g. 500" style={inputStyle} /></Field>
        {!showDim && (
          <Field label="Print sides">
            <Segmented value={data.sides} onChange={(v) => set("sides", v)}
              options={["Single-sided", "Double-sided"]} />
          </Field>
        )}
      </div>
      <Field label="Material / stock">
        <input value={data.material} onChange={(e) => set("material", e.target.value)}
          placeholder="e.g. 350gsm matte, PVC banner, vinyl…" style={inputStyle} />
      </Field>
      <Field label="Finishing">
        <input value={data.finish} onChange={(e) => set("finish", e.target.value)}
          placeholder="e.g. matte lamination, spot UV, eyelets…" style={inputStyle} />
      </Field>
      {tpl.includes("eyelets") && (
        <Field label="Eyelets / reinforced edges?">
          <Segmented value={data.eyelets} onChange={(v) => set("eyelets", v)} options={["Yes", "No"]} />
        </Field>
      )}
    </div>
  );
}

function StepEventPackage({ data, set }) {
  const items = ["Stage Branding", "Backdrop", "Exhibition Stand", "Roll-Up Banners",
    "Flags", "Directional Signs", "Registration Desk", "Branded Counters", "Table Covers",
    "Floor Graphics", "Event Programs", "Name Badges", "Lanyards", "Tickets"];
  const toggle = (it) => {
    const cur = data.eventItems;
    set("eventItems", cur.includes(it) ? cur.filter((x) => x !== it) : [...cur, it]);
  };
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Intro>Build your event package — tick everything you need and we'll quote it as one brief.</Intro>
      <div className="two-col">
        <Field label="Event type">
          <input value={data.eventType} onChange={(e) => set("eventType", e.target.value)}
            placeholder="Conference, launch, wedding…" style={inputStyle} /></Field>
        <Field label="Event date">
          <input type="date" value={data.eventDate} onChange={(e) => set("eventDate", e.target.value)} style={inputStyle} /></Field>
      </div>
      <Field label="Venue">
        <input value={data.venue} onChange={(e) => set("venue", e.target.value)}
          placeholder="Venue name & location" style={inputStyle} /></Field>
      <Field label="Branding requirements">
        <div className="pkg-grid">
          {items.map((it) => {
            const on = data.eventItems.includes(it);
            return (
              <button key={it} onClick={() => toggle(it)} style={{
                ...btnReset, padding: "11px 12px", borderRadius: 10, fontSize: 13.5, fontWeight: 600,
                textAlign: "left", display: "flex", alignItems: "center", gap: 8,
                border: `1.5px solid ${on ? BRAND.blue : BRAND.line}`,
                background: on ? "rgba(46,107,230,.06)" : "#fff" }}>
                <span style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: `1.5px solid ${on ? BRAND.blue : BRAND.line}`,
                  background: on ? BRAND.blue : "#fff", display: "grid", placeItems: "center" }}>
                  {on && <Check size={12} color="#fff" strokeWidth={3} />}
                </span>
                {it}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

function StepArtwork({ data, set, embedded }) {
  const fileRef = useRef();
  const onFiles = (e) => {
    const names = Array.from(e.target.files || []).map((f) => f.name);
    set("files", [...data.files, ...names]);
  };
  return (
    <div style={{ display: "grid", gap: 18 }}>
      {!embedded && <Intro>Do you already have artwork? Send it now, or let our studio create it.</Intro>}
      <Field label={embedded ? "Do you have artwork or a reference?" : "Artwork status"}>
        <div style={{ display: "grid", gap: 8 }}>
          {[
            ["have", "Yes — I have print-ready artwork"],
            ["adjust", "Yes — but it needs adjustments"],
            ["design", "No — Clone Hub should design it"],
          ].map(([v, label]) => (
            <button key={v} onClick={() => set("design", v)} style={{
              ...btnReset, padding: "13px 15px", borderRadius: 11, textAlign: "left", fontWeight: 600,
              fontSize: 14.5, display: "flex", alignItems: "center", gap: 10,
              border: `1.5px solid ${data.design === v ? BRAND.blue : BRAND.line}`,
              background: data.design === v ? "rgba(46,107,230,.06)" : "#fff" }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                border: `1.5px solid ${data.design === v ? BRAND.blue : BRAND.line}`,
                display: "grid", placeItems: "center" }}>
                {data.design === v && <span style={{ width: 9, height: 9, borderRadius: "50%", background: BRAND.blue }} />}
              </span>
              {label}
            </button>
          ))}
        </div>
      </Field>
      {data.design !== "design" && (
        <Field label="Upload artwork">
          <button onClick={() => fileRef.current?.click()} style={{
            ...btnReset, width: "100%", padding: 22, borderRadius: 12, border: `1.5px dashed ${BRAND.line}`,
            background: BRAND.mist, display: "flex", flexDirection: "column", alignItems: "center",
            gap: 8, color: BRAND.slate }}>
            <Upload size={24} color={BRAND.blue} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Tap to upload files</span>
            <span style={{ fontSize: 12 }}>PDF · PNG · JPG · SVG · AI · EPS · PSD · DOC · PPT</span>
          </button>
          <input ref={fileRef} type="file" multiple hidden onChange={onFiles}
            accept=".pdf,.png,.jpg,.jpeg,.svg,.ai,.eps,.psd,.doc,.docx,.ppt,.pptx" />
          {data.files.length > 0 && (
            <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
              {data.files.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13,
                  color: BRAND.slate, padding: "8px 12px", background: BRAND.mist, borderRadius: 8 }}>
                  <Check size={14} color={BRAND.blue} /> {f}
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize: 12, color: BRAND.slate, marginTop: 8 }}>
            File names are included in your request. Attach the actual files when you send on WhatsApp or email.
          </p>
        </Field>
      )}
    </div>
  );
}

function StepDelivery({ data, set, isEvent }) {
  const options = isEvent
    ? ["Pickup", "Delivery", "Delivery + Installation", "Full event setup", "Setup + Dismantling"]
    : ["Pickup", "Delivery", "Delivery + Installation", "Installation only"];
  const needsInstall = data.fulfillment && data.fulfillment !== "Pickup";
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Intro>How would you like to receive your order?</Intro>
      <div className="pick-grid">
        {options.map((o) => (
          <button key={o} onClick={() => set("fulfillment", o)} style={{
            ...btnReset, padding: "13px 14px", borderRadius: 11, textAlign: "left", fontWeight: 600,
            fontSize: 14, display: "flex", alignItems: "center", gap: 8,
            border: `1.5px solid ${data.fulfillment === o ? BRAND.blue : BRAND.line}`,
            background: data.fulfillment === o ? "rgba(46,107,230,.06)" : "#fff" }}>
            <Truck size={16} color={data.fulfillment === o ? BRAND.blue : BRAND.slate} /> {o}
          </button>
        ))}
      </div>
      {needsInstall && (
        <>
          <Field label="Location / venue">
            <input value={data.location} onChange={(e) => set("location", e.target.value)}
              placeholder="Delivery or installation address" style={inputStyle} /></Field>
          <Field label="Notes for installation / setup">
            <textarea value={data.installNotes} onChange={(e) => set("installNotes", e.target.value)}
              rows={2} placeholder="Access, timing, contact at venue…" style={inputStyle} /></Field>
        </>
      )}
      {data.fulfillment === "Delivery" && (
        <Field label="Delivery location">
          <input value={data.location} onChange={(e) => set("location", e.target.value)}
            placeholder="Where should we deliver?" style={inputStyle} /></Field>
      )}
      <Field label="Deadline / required date">
        <input type="date" value={data.deadline} onChange={(e) => set("deadline", e.target.value)} style={inputStyle} />
      </Field>
    </div>
  );
}

function StepDetails({ data, set }) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Intro>Almost done — how should Clone Hub reach you?</Intro>
      <Field label="Your name" required>
        <input value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" style={inputStyle} />
      </Field>
      <div className="two-col">
        <Field label="Phone / WhatsApp">
          <input value={data.phone} onChange={(e) => set("phone", e.target.value)}
            placeholder="+254…" style={inputStyle} /></Field>
        <Field label="Email">
          <input value={data.email} onChange={(e) => set("email", e.target.value)}
            placeholder="you@email.com" style={inputStyle} /></Field>
      </div>
      <Field label="Anything else we should know?">
        <textarea value={data.notes} onChange={(e) => set("notes", e.target.value)} rows={3}
          placeholder="Extra requirements, questions, reference notes…" style={inputStyle} />
      </Field>
      <p style={{ fontSize: 12.5, color: BRAND.slate }}>Add at least a phone or email so we can send your quote.</p>
    </div>
  );
}

function StepReview({ data, consult }) {
  const rows = reviewRows(data, consult);
  return (
    <div>
      <Intro>Review your request. Send it on WhatsApp for the fastest reply, or by email.</Intro>
      <div style={{ border: `1px solid ${BRAND.line}`, borderRadius: 14, overflow: "hidden", marginTop: 8 }}>
        {rows.map(([k, v], i) => (
          <div key={k} style={{ display: "flex", gap: 12, padding: "13px 16px",
            borderBottom: i < rows.length - 1 ? `1px solid ${BRAND.line}` : "none",
            background: i % 2 ? "#fff" : BRAND.mist }}>
            <span style={{ fontSize: 13, color: BRAND.slate, fontWeight: 600, width: 130, flexShrink: 0 }}>{k}</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuccessScreen({ message, data, close }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 8px" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(37,211,102,.12)",
        display: "grid", placeItems: "center", margin: "0 auto 20px" }}>
        <Check size={38} color="#25D366" strokeWidth={3} />
      </div>
      <h3 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 26,
        letterSpacing: "-1px", margin: 0 }}>Quote request received</h3>
      <p style={{ color: BRAND.slate, fontSize: 15.5, marginTop: 12, lineHeight: 1.55, maxWidth: 420,
        marginLeft: "auto", marginRight: "auto" }}>
        Thank you{data.name ? `, ${data.name.split(" ")[0]}` : ""}. Your project details are ready to send to Clone Hub.
        Continue on WhatsApp with your artwork attached, or email your brief.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
        <a href={waLink(message)} target="_blank" rel="noreferrer"
          style={{ ...primaryBtn, background: "#25D366", textDecoration: "none", padding: "15px 26px" }}>
          <MessageCircle size={18} /> Continue on WhatsApp
        </a>
        <a href={emailLink(message)}
          style={{ ...outlineBtn, textDecoration: "none", padding: "15px 22px" }}>
          <Mail size={17} /> Email instead
        </a>
      </div>
      <button onClick={close} style={{ ...btnReset, marginTop: 20, color: BRAND.slate,
        fontWeight: 600, fontSize: 14 }}>Back to site</button>
    </div>
  );
}

/* ---------- Quote helpers ---------- */
function reviewRows(data, consult) {
  const rows = [];
  if (consult) {
    if (data.goal) rows.push(["Goal", data.goal]);
    if (data.useFor) rows.push(["For", data.useFor]);
    if (data.howMany) rows.push(["Quantity", data.howMany]);
    if (data.whenNeeded) rows.push(["Needed by", data.whenNeeded]);
    if (data.whereUsed) rows.push(["Location", data.whereUsed]);
  } else {
    if (data.service) rows.push(["Service", data.service]);
    if (data.quantity) rows.push(["Quantity", data.quantity]);
    if (data.dimW || data.dimH) rows.push(["Size", `${data.dimW || "?"} × ${data.dimH || "?"}`]);
    if (data.sides) rows.push(["Sides", data.sides]);
    if (data.material) rows.push(["Material", data.material]);
    if (data.finish) rows.push(["Finishing", data.finish]);
    if (data.eyelets) rows.push(["Eyelets", data.eyelets]);
    if (data.eventType) rows.push(["Event", data.eventType]);
    if (data.eventDate) rows.push(["Event date", data.eventDate]);
    if (data.venue) rows.push(["Venue", data.venue]);
    if (data.eventItems.length) rows.push(["Package", data.eventItems.join(", ")]);
  }
  if (data.design) rows.push(["Artwork", { have: "Print-ready supplied", adjust: "Needs adjustments", design: "Design required" }[data.design]]);
  if (data.files.length) rows.push(["Files", data.files.join(", ")]);
  if (data.fulfillment) rows.push(["Fulfillment", data.fulfillment]);
  if (data.location) rows.push(["Location", data.location]);
  if (data.installNotes) rows.push(["Install notes", data.installNotes]);
  if (data.deadline) rows.push(["Deadline", data.deadline]);
  if (data.name) rows.push(["Name", data.name]);
  if (data.phone) rows.push(["Phone", data.phone]);
  if (data.email) rows.push(["Email", data.email]);
  if (data.notes) rows.push(["Notes", data.notes]);
  return rows;
}

function buildMessage(data, consult) {
  const L = ["Hello Clone Hub, I would like a quotation.", ""];
  reviewRows(data, consult).forEach(([k, v]) => L.push(`${k}: ${v}`));
  L.push("", "Sent from clonehub.co.ke");
  return L.join("\n");
}


/* ============================================================
   SEARCH MODAL
   ============================================================ */
function SearchModal({ close, go }) {
  const { services: SERVICES } = useContent();
  const [q, setQ] = useState("");
  const ref = useRef();
  useEffect(() => { ref.current?.focus(); }, []);
  const results = q ? SERVICES.filter((s) => s.name.toLowerCase().includes(q.toLowerCase())).slice(0, 8) : [];
  return (
    <div className="modal-backdrop" onClick={close} style={{ alignItems: "flex-start", paddingTop: "12vh" }}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px",
          borderBottom: `1px solid ${BRAND.line}` }}>
          <Search size={20} color={BRAND.slate} />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search: business card, banner, wedding, vehicle…"
            style={{ border: "none", outline: "none", flex: 1, fontSize: 17 }} />
          <button onClick={close} style={btnReset}><X size={22} color={BRAND.slate} /></button>
        </div>
        <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
          {q && results.length === 0 && (
            <div style={{ padding: 30, textAlign: "center", color: BRAND.slate }}>No matches for "{q}".</div>
          )}
          {results.map((s) => (
            <button key={s.name} onClick={() => { go("service", { service: s }); close(); }}
              className="search-result" style={btnReset}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
                <div style={{ fontSize: 13, color: BRAND.slate }}>
                  {CATEGORIES.find((c) => c.id === s.category)?.name}
                </div>
              </div>
              <ArrowRight size={17} color={BRAND.slate} />
            </button>
          ))}
          {!q && (
            <div style={{ padding: "16px 20px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: BRAND.slate, letterSpacing: ".5px",
                textTransform: "uppercase", marginBottom: 10 }}>Popular</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Business Cards", "Pull-Up & Roll-Up Banners", "Vehicle Branding", "Event Backdrops",
                  "Logo Design", "Custom Boxes & Cartons"].map((n) => (
                  <button key={n} onClick={() => setQ(n.split(" ")[0])} className="finish-pill"
                    style={{ cursor: "pointer" }}>{n}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SHARED LAYOUT PIECES
   ============================================================ */
function Section({ eyebrow, title, sub, children }) {
  return (
    <section className="wrap" style={{ padding: "84px 0" }}>
      <SectionHead eyebrow={eyebrow} title={title} sub={sub} />
      {children}
    </section>
  );
}

function SectionHead({ eyebrow, title, sub, light, align = "center" }) {
  return (
    <div style={{ textAlign: align, maxWidth: align === "center" ? 640 : "none",
      margin: align === "center" ? "0 auto 46px" : "0 0 20px" }}>
      {eyebrow && <div style={{ color: BRAND.blue, fontWeight: 700, fontSize: 13,
        letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>{eyebrow}</div>}
      <h2 style={{ fontFamily: "var(--display)", fontWeight: 800,
        fontSize: "clamp(28px,4.5vw,46px)", letterSpacing: "-1.2px", lineHeight: 1.05, margin: 0,
        color: light ? "#fff" : BRAND.ink }}>{title}</h2>
      {sub && <p style={{ fontSize: 17, color: light ? "rgba(255,255,255,.7)" : BRAND.slate,
        marginTop: 16, lineHeight: 1.55 }}>{sub}</p>}
    </div>
  );
}

function PageHeader({ title, crumb, sub }) {
  return (
    <section style={{ background: BRAND.mist, borderBottom: `1px solid ${BRAND.line}` }}>
      <div className="wrap" style={{ padding: "56px 0 40px" }}>
        <div style={{ color: BRAND.blue, fontWeight: 700, fontSize: 13, letterSpacing: "1px",
          textTransform: "uppercase", marginBottom: 10 }}>{crumb}</div>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 800,
          fontSize: "clamp(34px,6vw,60px)", letterSpacing: "-1.5px", lineHeight: 1, margin: 0 }}>{title}</h1>
        {sub && <p style={{ fontSize: 17, color: BRAND.slate, marginTop: 18, maxWidth: 620, lineHeight: 1.55 }}>{sub}</p>}
      </div>
    </section>
  );
}

function Footer({ go, openQuote }) {
  const { site: SITE } = useContent();
  return (
    <footer style={{ background: BRAND.ink, color: "#fff" }}>
      <div className="wrap footer-grid" style={{ padding: "64px 0 40px" }}>
        <div style={{ maxWidth: 320 }}>
          <Wordmark light size={34} />
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14.5, marginTop: 18, lineHeight: 1.6 }}>
            Design, printing, branding and installation in Nairobi. From business cards to billboards —
            we handle the entire project.
          </p>
          <a href={waLink()} target="_blank" rel="noreferrer"
            style={{ ...lightBtn, textDecoration: "none", marginTop: 20, display: "inline-flex" }}>
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
        <div>
          <FooterHead>Services</FooterHead>
          {CATEGORIES.slice(0, 6).map((c) => (
            <FooterLink key={c.id} onClick={() => go("services", { filter: c.id })}>{c.name}</FooterLink>
          ))}
        </div>
        <div>
          <FooterHead>Company</FooterHead>
          <FooterLink onClick={() => go("services")}>All services</FooterLink>
          <FooterLink onClick={() => go("portfolio")}>Selected work</FooterLink>
          <FooterLink onClick={() => go("catalogue")}>Catalogue</FooterLink>
          <FooterLink onClick={() => go("contact")}>Contact</FooterLink>
          <FooterLink onClick={() => openQuote()}>Get a quote</FooterLink>
        </div>
        <div>
          <FooterHead>Contact</FooterHead>
          <div style={{ display: "grid", gap: 12, marginTop: 4 }}>
            <FootRow icon={MapPin}>{SITE.address}</FootRow>
            <FootRow icon={Phone} href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</FootRow>
            <FootRow icon={Phone} href={`tel:${SITE.phone2.replace(/\s/g, "")}`}>{SITE.phone2}</FootRow>
            <FootRow icon={Mail} href={`mailto:${SITE.email}`}>{SITE.email}</FootRow>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.1)" }}>
        <div className="wrap footer-bottom" style={{ padding: "20px 0" }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>
            © {new Date().getFullYear()} Clone Hub Prints. All rights reserved.
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>
            Nairobi, Kenya · Design · Print · Brand · Install
          </span>
        </div>
      </div>
    </footer>
  );
}
function FooterHead({ children }) {
  return <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14,
    color: "rgba(255,255,255,.9)" }}>{children}</div>;
}
function FooterLink({ children, onClick }) {
  return <button onClick={onClick} className="footer-link" style={{
    ...btnReset, display: "block", color: "rgba(255,255,255,.6)", fontSize: 14.5,
    padding: "5px 0", textAlign: "left" }}>{children}</button>;
}
function FootRow({ icon: Icon, children, href }) {
  const el = (
    <div style={{ display: "flex", gap: 10, color: "rgba(255,255,255,.6)", fontSize: 14, alignItems: "flex-start" }}>
      <Icon size={16} style={{ marginTop: 2, flexShrink: 0 }} /> <span>{children}</span>
    </div>
  );
  return href ? <a href={href} style={{ textDecoration: "none" }} className="footer-link">{el}</a> : el;
}

function FloatingBar({ openQuote }) {
  return (
    <>
      <a href={waLink()} target="_blank" rel="noreferrer" className="fab-wa desktop-fab"
        aria-label="Chat on WhatsApp">
        <MessageCircle size={26} color="#fff" />
      </a>
      <div className="mobile-bar mobile-only">
        <a href={waLink()} target="_blank" rel="noreferrer" className="mobile-bar-wa">
          <MessageCircle size={20} /> WhatsApp
        </a>
        <button onClick={() => openQuote()} className="mobile-bar-quote">
          Get a Quote
        </button>
      </div>
    </>
  );
}

/* ---------- Small form atoms ---------- */
function Field({ label, required, children }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 7,
        color: BRAND.ink }}>{label}{required && <span style={{ color: BRAND.blue }}> *</span>}</span>
      {children}
    </label>
  );
}
function Intro({ children }) {
  return <p style={{ fontSize: 15, color: BRAND.slate, lineHeight: 1.55, margin: 0 }}>{children}</p>;
}
function Segmented({ value, onChange, options }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} style={{
          ...btnReset, flex: 1, padding: "11px 10px", borderRadius: 10, fontWeight: 600, fontSize: 13.5,
          border: `1.5px solid ${value === o ? BRAND.blue : BRAND.line}`,
          background: value === o ? "rgba(46,107,230,.06)" : "#fff",
          color: value === o ? BRAND.blue : BRAND.slate }}>{o}</button>
      ))}
    </div>
  );
}

/* ---------- Style tokens ---------- */
const btnReset = { border: "none", background: "none", cursor: "pointer", font: "inherit", padding: 0, color: "inherit" };
const primaryBtn = {
  display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 22px", borderRadius: 12,
  background: BRAND.blue, color: "#fff", fontWeight: 700, fontSize: 15, border: "none",
  cursor: "pointer", boxShadow: "0 8px 24px rgba(46,107,230,.28)", transition: "transform .15s",
};
const ghostBtn = {
  display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 12,
  background: "#fff", color: BRAND.navy, fontWeight: 700, fontSize: 15,
  border: `1.5px solid ${BRAND.line}`, cursor: "pointer",
};
const lightBtn = {
  display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", borderRadius: 12,
  background: "rgba(255,255,255,.12)", color: "#fff", fontWeight: 700, fontSize: 15,
  border: "1px solid rgba(255,255,255,.22)", cursor: "pointer", backdropFilter: "blur(4px)",
};
const outlineBtn = {
  display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12,
  background: "#fff", color: BRAND.navy, fontWeight: 700, fontSize: 15,
  border: `1.5px solid ${BRAND.navy}`, cursor: "pointer",
};
const tinyBtn = {
  ...btnReset, padding: "9px 14px", borderRadius: 9, fontWeight: 700, fontSize: 13,
  border: `1.5px solid ${BRAND.line}`, color: BRAND.navy, flex: 1, textAlign: "center",
};
const tinyPrimary = {
  ...btnReset, padding: "9px 14px", borderRadius: 9, fontWeight: 700, fontSize: 13,
  background: BRAND.blue, color: "#fff", flex: 1, textAlign: "center",
};
const inputStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 11, border: `1.5px solid ${BRAND.line}`,
  fontSize: 15, outline: "none", fontFamily: "inherit", background: "#fff", boxSizing: "border-box",
};
const mobileRow = {
  ...btnReset, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "13px 8px", fontWeight: 700, fontSize: 16.5, borderBottom: `1px solid ${BRAND.line}`,
};

/* ---------- Global CSS ---------- */
function GlobalStyle() {
  return (
    <style>{`
            * { box-sizing: border-box; }
      body { margin: 0; }
      .wrap { max-width: 1180px; margin: 0 auto; padding-left: 24px; padding-right: 24px; }
      button, a { -webkit-tap-highlight-color: transparent; }
      .primaryBtn:hover { transform: translateY(-1px); }

      /* nav responsive */
      .header-bar { height: 74px; }
      @media (max-width: 900px) { .header-bar { height: 56px; } }
      .mobile-only { display: none; }
      @media (max-width: 900px) {
        .desktop-nav { display: none !important; }
        .mobile-only { display: block; }
        .desktop-fab { display: none !important; }
      }

      /* hero */
      .hero-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 50px; align-items: center; }
      @media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; gap: 40px; } .hero-visual { order: 2; } }
      .hero-photo-wrap { position: relative; }
      .hero-photo { width: 100%; border-radius: 22px; display: block;
        box-shadow: 0 30px 70px rgba(0,0,0,.45); border: 1px solid rgba(255,255,255,.1);
        animation: floatUp .7s ease both; }
      @keyframes floatUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
      .hero-photo-badge { position: absolute; bottom: -18px; left: -14px; display: flex; gap: 10px;
        align-items: center; background: #fff; padding: 12px 16px 12px 12px; border-radius: 14px;
        box-shadow: 0 16px 40px rgba(0,0,0,.25); animation: floatUp .7s ease .3s both; }
      @media (max-width: 900px) { .hero-photo-badge { left: 50%; transform: translateX(-50%); bottom: -20px; } }

      .reveal { animation: rise .7s ease both; }
      .d1 { animation-delay: .08s; } .d2 { animation-delay: .16s; }
      .d3 { animation-delay: .24s; } .d4 { animation-delay: .32s; }
      @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

      .trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
      @media (max-width: 780px) { .trust-grid { grid-template-columns: 1fr 1fr; gap: 18px; } }

      .cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
      @media (max-width: 820px) { .cat-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 440px) { .cat-grid { grid-template-columns: 1fr; } }
      .cat-card { position: relative; display: flex; align-items: center; gap: 14px;
        padding: 16px 18px; border-radius: 16px; border: 1px solid ${BRAND.line};
        background: #fff; text-align: left; transition: .2s; }
      .cat-card:hover { border-color: ${BRAND.blue}; box-shadow: 0 12px 30px rgba(15,23,42,.08); transform: translateY(-2px); }
      .cat-icon { width: 46px; height: 46px; border-radius: 12px; background: ${BRAND.mist};
        display: grid; place-items: center; flex-shrink: 0; transition: .2s; }
      .cat-card:hover .cat-icon { background: rgba(46,107,230,.1); }
      .cat-text { flex: 1; min-width: 0; }
      .cat-name { font-weight: 700; font-size: 16px; letter-spacing: -.2px; }
      .cat-count { font-size: 12.5px; color: ${BRAND.slate}; margin-top: 2px; }
      .cat-chevron { color: ${BRAND.line}; flex-shrink: 0; transition: .2s; }
      .cat-card:hover .cat-chevron { color: ${BRAND.blue}; transform: translateX(3px); }
      .cat-cta { background: linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue}); border: none; }
      .cat-cta .cat-icon.cta { background: rgba(255,255,255,.16); }
      .cat-cta:hover .cat-icon.cta { background: rgba(255,255,255,.24); }

      .work-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 1fr; gap: 16px; }
      .work-card { border-radius: 16px; overflow: hidden; background: #fff; border: 1px solid ${BRAND.line}; }
      .work-card.featured { grid-column: span 2; grid-row: span 2; }
      @media (max-width: 820px) { .work-grid { grid-template-columns: 1fr 1fr; }
        .work-card.featured { grid-column: span 2; grid-row: span 1; } }
      @media (max-width: 520px) { .work-grid { grid-template-columns: 1fr; }
        .work-card.featured { grid-column: span 1; } }
      .work-media { position: relative; aspect-ratio: 4/3; display: grid; place-items: center; overflow: hidden; }
      .work-card.featured .work-media { aspect-ratio: 16/11; }
      .work-demo { position: absolute; top: 12px; left: 12px; font-size: 11px; font-weight: 700;
        color: #fff; background: rgba(0,0,0,.35); padding: 3px 9px; border-radius: 6px; letter-spacing: .5px; }
      .work-body { padding: 16px; }
      .work-cat { font-size: 11.5px; font-weight: 700; color: ${BRAND.blue}; background: rgba(46,107,230,.1);
        padding: 4px 10px; border-radius: 6px; letter-spacing: .5px; }

      .client-marquee { position: relative; overflow: hidden; margin-top: 8px;
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
      .client-track { display: flex; gap: 14px; width: max-content; animation: marquee 28s linear infinite; }
      .client-marquee:hover .client-track { animation-play-state: paused; }
      @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      .client-badge { display: grid; place-items: center; min-width: 150px; height: 84px;
        padding: 0 22px; border-radius: 14px; border: 1px solid ${BRAND.line}; background: #fff;
        font-weight: 800; font-size: 19px; color: ${BRAND.navy}; letter-spacing: -.4px; flex-shrink: 0; }
      @media (prefers-reduced-motion: reduce) { .client-track { animation: none; flex-wrap: wrap; justify-content: center; width: auto; } }

      .process-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; }
      @media (max-width: 900px) { .process-grid { grid-template-columns: repeat(3, 1fr); } }
      @media (max-width: 520px) { .process-grid { grid-template-columns: 1fr 1fr; } }
      .process-step { position: relative; padding: 22px 18px; border-radius: 16px;
        background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.09); }
      .process-num { font-family: 'Bricolage Grotesque'; font-weight: 800; font-size: 30px;
        color: rgba(91,184,232,.3); line-height: 1; }
      .process-icon { width: 44px; height: 44px; border-radius: 11px; background: rgba(91,184,232,.12);
        display: grid; place-items: center; margin-top: 14px; }

      .notsure { background: ${BRAND.mist}; border-radius: 24px; padding: 44px;
        display: flex; align-items: center; justify-content: space-between; gap: 30px; flex-wrap: wrap; }

      .why-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 40px; align-items: start; }
      @media (max-width: 820px) { .why-grid { grid-template-columns: 1fr; gap: 24px; } }
      .why-card { display: flex; gap: 14px; padding: 22px; border-radius: 16px; background: #fff;
        border: 1px solid ${BRAND.line}; }
      .why-check { width: 28px; height: 28px; border-radius: 8px; background: ${BRAND.blue};
        display: grid; place-items: center; flex-shrink: 0; }

      .cta-band { position: relative; overflow: hidden; border-radius: 28px; padding: 70px 40px;
        text-align: center; background: linear-gradient(135deg, ${BRAND.ink}, ${BRAND.navy}); }
      .cta-glow { position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
        width: 500px; height: 300px; background: radial-gradient(circle, rgba(46,107,230,.5), transparent 70%); }

      .faq-item { border: 1px solid ${BRAND.line}; border-radius: 14px; overflow: hidden; background: #fff; }

      /* services */
      .svc-search { display: flex; align-items: center; gap: 12px; padding: 15px 20px; margin: 30px 0 20px;
        border-radius: 14px; border: 1.5px solid ${BRAND.line}; background: #fff; }
      .chip-row { display: flex; gap: 10px; overflow-x: auto; padding: 6px 0 16px; margin: 20px 0; }
      .chip-row::-webkit-scrollbar { height: 0; }
      .chip-count { font-size: 11px; opacity: .6; }
      .svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
      @media (max-width: 820px) { .svc-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 520px) { .svc-grid { grid-template-columns: 1fr; } }
      .svc-card { display: flex; flex-direction: column; padding: 20px; border-radius: 16px;
        border: 1px solid ${BRAND.line}; background: #fff; transition: .2s; }
      .svc-card:hover { box-shadow: 0 14px 34px rgba(15,23,42,.08); border-color: #cdd8ea; }
      .svc-tag { font-size: 11px; font-weight: 700; color: ${BRAND.slate}; letter-spacing: .5px;
        text-transform: uppercase; }

      /* detail */
      .detail-grid { display: grid; grid-template-columns: 1.3fr .7fr; gap: 40px; align-items: center; }
      @media (max-width: 820px) { .detail-grid { grid-template-columns: 1fr; } .detail-visual { display: none; } }
      .detail-visual { aspect-ratio: 1; border-radius: 24px; display: grid; place-items: center; }
      .detail-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
      @media (max-width: 820px) { .detail-cols { grid-template-columns: 1fr; } }
      .detail-block { padding: 26px; border-radius: 18px; border: 1px solid ${BRAND.line}; background: #fff; }
      .tick-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
      .tick-list li { display: flex; gap: 10px; align-items: flex-start; font-size: 14.5px; color: ${BRAND.slate}; }
      .tick-list li svg { margin-top: 3px; flex-shrink: 0; }
      .finish-pill { font-size: 13px; font-weight: 600; color: ${BRAND.navy}; background: ${BRAND.mist};
        padding: 7px 13px; border-radius: 999px; border: 1px solid ${BRAND.line}; }

      /* portfolio */
      .masonry { columns: 3; column-gap: 16px; margin-top: 8px; }
      @media (max-width: 820px) { .masonry { columns: 2; } }
      @media (max-width: 500px) { .masonry { columns: 1; } }
      .masonry-item { width: 100%; margin-bottom: 16px; break-inside: avoid; display: block; }
      .masonry-media { position: relative; border-radius: 16px; display: grid; place-items: center;
        overflow: hidden; }
      .masonry-media.has-img { display: block; }
      .masonry-media.has-img img { width: 100%; height: auto; display: block; }
      .masonry-overlay { position: absolute; inset: 0; display: flex; flex-direction: column;
        justify-content: flex-end; padding: 18px; opacity: 0; transition: .25s;
        background: linear-gradient(transparent, rgba(11,18,32,.7)); }
      .masonry-item:hover .masonry-overlay { opacity: 1; }
      /* catalogue page */
      .cat-jump { display: flex; gap: 8px; overflow-x: auto; padding: 8px 0 4px; }
      .cat-jump::-webkit-scrollbar { height: 0; }
      .cat-jump-chip { flex-shrink: 0; padding: 8px 14px; border-radius: 999px; font-size: 13px;
        font-weight: 600; color: ${BRAND.slate}; background: #fff; border: 1px solid ${BRAND.line};
        text-decoration: none; white-space: nowrap; transition: .15s; }
      .cat-jump-chip:hover { border-color: ${BRAND.blue}; color: ${BRAND.navy}; }
      .cat-section { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; align-items: center;
        padding: 44px 0; border-bottom: 1px solid ${BRAND.line}; scroll-margin-top: 90px; }
      @media (max-width: 780px) { .cat-section { grid-template-columns: 1fr; gap: 24px; direction: ltr !important; } }
      .cat-sec-media { position: relative; border-radius: 20px; overflow: hidden; aspect-ratio: 4/3;
        background: ${BRAND.ink}; box-shadow: 0 20px 50px rgba(15,23,42,.12); }
      .cat-sec-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .cat-sec-index { position: absolute; top: 14px; left: 16px; font-family: var(--display);
        font-weight: 800; font-size: 40px; color: rgba(255,255,255,.9); line-height: 1;
        text-shadow: 0 2px 12px rgba(0,0,0,.4); }
      .cat-sec-eyebrow { color: ${BRAND.blue}; font-weight: 700; font-size: 12.5px; letter-spacing: 1.5px;
        text-transform: uppercase; margin-bottom: 10px; }
      .cat-sec-title { font-family: var(--display); font-weight: 800; font-size: clamp(26px,3.6vw,38px);
        letter-spacing: -1px; line-height: 1.05; margin: 0 0 14px; }
      .cat-sec-intro { font-size: 16px; color: ${BRAND.slate}; line-height: 1.55; margin: 0 0 20px; }
      .cat-sec-items { display: flex; flex-wrap: wrap; gap: 8px; }
      .cat-sec-item { display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px;
        font-weight: 600; color: ${BRAND.navy}; background: ${BRAND.mist}; padding: 7px 12px;
        border-radius: 999px; border: 1px solid ${BRAND.line}; }


        display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
      .lightbox { position: fixed; inset: 0; background: rgba(11,18,32,.9); z-index: 100;
        display: grid; place-items: center; padding: 24px; }
      .lightbox-inner { max-width: 560px; width: 100%; }

      /* contact */
      .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding-top: 40px; }
      @media (max-width: 820px) { .contact-grid { grid-template-columns: 1fr; } }
      .contact-row { display: flex; align-items: center; gap: 16px; padding: 18px; border-radius: 14px;
        border: 1.5px solid ${BRAND.line}; background: #fff; transition: .2s; }
      .contact-row:hover { box-shadow: 0 10px 26px rgba(15,23,42,.07); }
      .contact-cta { position: relative; overflow: hidden; border-radius: 24px; padding: 44px;
        background: linear-gradient(140deg, ${BRAND.ink}, ${BRAND.navy}); }

      /* footer */
      .footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1.2fr; gap: 34px; }
      @media (max-width: 820px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 30px; } }
      @media (max-width: 500px) { .footer-grid { grid-template-columns: 1fr; } }
      .footer-link:hover { color: #fff !important; }
      .footer-bottom { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }

      /* fab + mobile bar */
      .fab-wa { position: fixed; bottom: 26px; right: 26px; width: 60px; height: 60px; border-radius: 50%;
        background: #25D366; display: grid; place-items: center; z-index: 40;
        box-shadow: 0 10px 30px rgba(37,211,102,.4); animation: pulse 2.5s infinite; }
      @keyframes pulse { 0%,100% { box-shadow: 0 10px 30px rgba(37,211,102,.4); }
        50% { box-shadow: 0 10px 40px rgba(37,211,102,.6); } }
      .mobile-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 40; display: flex; gap: 10px;
        padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); background: rgba(255,255,255,.96);
        backdrop-filter: blur(12px); border-top: 1px solid ${BRAND.line}; }
      .mobile-bar-wa { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
        padding: 14px; border-radius: 12px; background: #25D366; color: #fff; font-weight: 700;
        font-size: 15px; text-decoration: none; }
      .mobile-bar-quote { flex: 1; padding: 14px; border-radius: 12px; background: ${BRAND.blue};
        color: #fff; font-weight: 700; font-size: 15px; border: none; cursor: pointer; }
      @media (max-width: 900px) { main { padding-bottom: 84px; } }

      /* modals */
      .modal-backdrop { position: fixed; inset: 0; background: rgba(11,18,32,.6); z-index: 90;
        display: flex; align-items: center; justify-content: center; padding: 20px;
        backdrop-filter: blur(4px); animation: fade .2s ease; }
      @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
      .modal { width: 100%; max-width: 560px; max-height: 90vh; background: #fff; border-radius: 22px;
        overflow: hidden; display: flex; flex-direction: column; animation: pop .25s ease; }
      @keyframes pop { from { transform: translateY(20px) scale(.98); opacity: 0; } to { transform: none; opacity: 1; } }
      .modal-head { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px;
        background: linear-gradient(120deg, ${BRAND.ink}, ${BRAND.navy}); }
      .progress { display: flex; gap: 4px; padding: 0 24px; background: ${BRAND.navy}; padding-bottom: 14px; }
      .progress-seg { flex: 1; height: 4px; border-radius: 2px; transition: .3s; }
      .modal-body { padding: 24px; overflow-y: auto; flex: 1; }
      .modal-foot { display: flex; justify-content: space-between; align-items: center; gap: 12px;
        padding: 18px 24px; border-top: 1px solid ${BRAND.line}; background: #fff; }
      .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      @media (max-width: 480px) { .two-col { grid-template-columns: 1fr; } }
      .pick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      @media (max-width: 480px) { .pick-grid { grid-template-columns: 1fr; } }
      .pkg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      @media (max-width: 480px) { .pkg-grid { grid-template-columns: 1fr; } }

      .search-modal { width: 100%; max-width: 560px; background: #fff; border-radius: 18px;
        overflow: hidden; animation: pop .2s ease; }
      .search-result { width: 100%; display: flex; justify-content: space-between; align-items: center;
        padding: 15px 20px; border-bottom: 1px solid ${BRAND.line}; text-align: left; }
      .search-result:hover { background: ${BRAND.mist}; }
      .mega-item:hover { background: ${BRAND.mist}; }

      input:focus, textarea:focus { border-color: ${BRAND.blue} !important; }
      button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible {
        outline: 2px solid ${BRAND.blue}; outline-offset: 2px; }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation: none !important; transition: none !important; }
      }
    `}</style>
  );
}
