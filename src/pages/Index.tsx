import React, { useState, useEffect, useRef } from "react";
import {
  Target,
  ListChecks,
  Handshake,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  const navItems = [
    { name: "Varianten", href: "#varianten", scrollTo: "varianten" },
    { name: "Vorteile", href: "#vorteile", scrollTo: "vorteile" },
    { name: "Kontakt", href: "#kontakt", scrollTo: "kontakt" },
  ];

  const handleScrollTo =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    };

  const handleScrollToDiv =
    (id: string) =>
    (
      e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ) => {
      e.preventDefault?.();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    };

  const handleMobileLinkClick =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      handleScrollTo(id)(e);
      setIsMobileMenuOpen(false);
    };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header
        ref={addToRefs}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm animated-element"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <img
              src="/logo.png"
              alt="Münchner Energie Agentur Logo"
              className="h-16"
            />
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="nav-link"
                  onClick={handleScrollTo(item.scrollTo)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-700 hover:text-brand-green relative z-50"
                aria-label="Menü öffnen/schließen"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-white z-40 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <nav className="flex flex-col items-center space-y-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-2xl font-semibold text-slate-800 hover:text-brand-green"
                  onClick={handleMobileLinkClick(item.scrollTo)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        ref={addToRefs}
        className="relative py-20 md:py-32 bg-gradient-to-br from-brand-teal to-brand-green-dark text-white animated-element"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Starke Partnerschaft für Kaminkehrerkollegen
          </h1>
          <p
            className="text-xl md:text-2xl mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Mehr Umsatz und zufriedene Kunden – ganz einfach nebenbei!
          </p>
          {/* Video Section */}
          <div
            className="flex justify-center mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.45s" }}
          >
            <video
              className="w-full max-w-64 rounded-lg shadow-lg border-white border-4"
              controls
              preload="metadata"
            >
              <source src="/videos/stefan.mp4" type="video/mp4" />
              Ihr Browser unterstützt das Video-Element nicht.
            </video>
          </div>
          {/* Profilbereich: Bild links, Text rechts */}
          <div
            className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <img
              src="/profilbild_stefan.jpeg"
              alt="Stefan Grunwald-Wiese"
              className="w-56 h-56 rounded-full border-4 border-white shadow-lg object-cover object-[center_0%]"
              style={{ objectPosition: "center 0%" }}
            />
            <div className="text-center md:text-left max-w-xl">
              <p className="text-lg italic">
                „Als Kaminkehrer-Kollege weiß ich, wie wichtig Vertrauen und
                Partnerschaft sind. Lass uns gemeinsam mehr erreichen!“
              </p>
              <span className="mt-2 block font-semibold">
                Stefan Grunwald-Wiese
              </span>
            </div>
          </div>
          <div
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <a
              href="#variante-a"
              className="btn btn-green text-lg px-8 py-4"
              onClick={handleScrollTo("varianten")}
            >
              Variante A: Energieberatung integrieren
            </a>
            <a
              href="#variante-b"
              className="btn btn-blue text-lg px-8 py-4"
              onClick={handleScrollTo("varianten")}
            >
              Variante B: Empfehlungspartner werden
            </a>
          </div>
        </div>
      </section>

      {/* Variants Introduction Section */}
      <section
        id="varianten"
        ref={addToRefs}
        className="py-16 md:py-24 bg-white animated-element"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-slate-800">
            Deine Möglichkeiten als Kaminkehrerkollege
          </h2>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Variant A Card */}
            <div
              id="variante-a"
              ref={addToRefs}
              className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-xl shadow-xl border-t-4 border-brand-green animated-element transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-green"
              tabIndex={0}
              onClick={handleScrollToDiv("vorteile")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleScrollToDiv("vorteile")(e);
                }
              }}
            >
              <div className="flex items-center mb-6">
                <Target className="w-10 h-10 text-brand-green mr-4" />
                <h3 className="text-2xl font-semibold text-brand-green-dark">
                  Variante A: Energieberatung selbst anbieten
                </h3>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <ListChecks className="w-5 h-5 text-brand-green mr-2 mt-1 flex-shrink-0" />{" "}
                  Erweitere dein Leistungsspektrum
                </li>
                <li className="flex items-start">
                  <ListChecks className="w-5 h-5 text-brand-green mr-2 mt-1 flex-shrink-0" />{" "}
                  Ein Komplettpaket für Kunden aus einer Hand
                </li>
                <li className="flex items-start">
                  <ListChecks className="w-5 h-5 text-brand-green mr-2 mt-1 flex-shrink-0" />{" "}
                  Höhere Stundensätze durch Zusatzservice
                </li>
                <li className="flex items-start">
                  <ListChecks className="w-5 h-5 text-brand-green mr-2 mt-1 flex-shrink-0" />{" "}
                  Direkte Abrechnung über dich
                </li>
              </ul>
            </div>
            {/* Variant B Card */}
            <div
              id="variante-b"
              ref={addToRefs}
              className="bg-gradient-to-br from-sky-50 to-blue-100 p-8 rounded-xl shadow-xl border-t-4 border-brand-blue animated-element transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue"
              tabIndex={0}
              style={{ animationDelay: "0.2s" }}
              onClick={handleScrollToDiv("vorteile")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleScrollToDiv("vorteile")(e);
                }
              }}
            >
              <div className="flex items-center mb-6">
                <Handshake className="w-10 h-10 text-brand-blue mr-4" />
                <h3 className="text-2xl font-semibold text-brand-blue-dark">
                  Variante B: Empfehlungspartner der MEA
                </h3>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <ListChecks className="w-5 h-5 text-brand-blue mr-2 mt-1 flex-shrink-0" />{" "}
                  Weiterempfehlen und Provision erhalten
                </li>
                <li className="flex items-start">
                  <ListChecks className="w-5 h-5 text-brand-blue mr-2 mt-1 flex-shrink-0" />{" "}
                  Kein zusätzlicher Aufwand vor Ort
                </li>
                <li className="flex items-start">
                  <ListChecks className="w-5 h-5 text-brand-blue mr-2 mt-1 flex-shrink-0" />{" "}
                  Agentur übernimmt Beratung & Abrechnung
                </li>
                <li className="flex items-start">
                  <ListChecks className="w-5 h-5 text-brand-blue mr-2 mt-1 flex-shrink-0" />{" "}
                  Regelmäßige Auszahlungen
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Table Section */}
      <section
        id="vorteile"
        ref={addToRefs}
        className="py-16 md:py-24 bg-slate-100 animated-element"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-slate-800">
            Was hast du davon?
          </h2>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto shadow-xl rounded-lg">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-50 rounded-tl-lg border-b border-slate-200">
                    Benefit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider bg-brand-green/10 text-brand-green-dark border-b border-slate-200 border-l border-slate-200">
                    Variante A
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider bg-brand-blue/10 text-brand-blue-dark rounded-tr-lg border-b border-slate-200 border-l border-slate-200">
                    Variante B
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  {
                    benefit: "Umsatzpotenzial",
                    varA: "Höhere Marge durch Beratung",
                    varB: "Stabile Provision ohne Risiko",
                  },
                  {
                    benefit: "Arbeitsaufwand",
                    varA: "Moderater Mehraufwand vor Ort",
                    varB: "Empfehlung via einfache Kontaktweitergabe",
                  },
                  {
                    benefit: "Verantwortung",
                    varA: "Volle Kontrolle & Abrechnung",
                    varB: "MEA übernimmt Haftung & Abwicklung",
                  },
                  {
                    benefit: "Kundenbindung",
                    varA: "Direkter Kontakt festigt Beziehung",
                    varB: "Wiederkehrende Provisionen",
                  },
                ].map((row, index) => (
                  <tr
                    key={index}
                    className={
                      (index % 2 === 0 ? "bg-white" : "bg-slate-50/50") +
                      " transition-all duration-200 hover:bg-brand-green/20 hover:shadow-md"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {row.benefit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm bg-brand-green/10 text-brand-green-dark border-l border-slate-200">
                      {row.varA}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm bg-brand-blue/10 text-brand-blue-dark border-l border-slate-200">
                      {row.varB}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-6">
            {[
              {
                benefit: "Umsatzpotenzial",
                varA: "Höhere Marge durch Beratung",
                varB: "Stabile Provision ohne Risiko",
              },
              {
                benefit: "Arbeitsaufwand",
                varA: "Moderater Mehraufwand vor Ort",
                varB: "Empfehlung via einfache Kontaktweitergabe",
              },
              {
                benefit: "Verantwortung",
                varA: "Volle Kontrolle & Abrechnung",
                varB: "MEA übernimmt Haftung & Abwicklung",
              },
              {
                benefit: "Kundenbindung",
                varA: "Direkter Kontakt festigt Beziehung",
                varB: "Wiederkehrende Provisionen",
              },
            ].map((row, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Benefit Header */}
                <h3 className="text-lg font-semibold text-slate-900 mb-6 text-center border-b border-slate-200 pb-3">
                  {row.benefit}
                </h3>

                {/* Variants Container */}
                <div className="space-y-4">
                  {/* Variante A */}
                  <div className="bg-gradient-to-r from-brand-green/10 to-brand-green/5 p-4 rounded-lg border-l-4 border-brand-green transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center mb-2">
                      <Target className="w-4 h-4 text-brand-green mr-2" />
                      <div className="text-xs font-medium text-brand-green-dark uppercase tracking-wider">
                        Variante A
                      </div>
                    </div>
                    <div className="text-sm text-brand-green-dark leading-relaxed">
                      {row.varA}
                    </div>
                  </div>

                  {/* Variante B */}
                  <div className="bg-gradient-to-r from-brand-blue/10 to-brand-blue/5 p-4 rounded-lg border-l-4 border-brand-blue transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center mb-2">
                      <Handshake className="w-4 h-4 text-brand-blue mr-2" />
                      <div className="text-xs font-medium text-brand-blue-dark uppercase tracking-wider">
                        Variante B
                      </div>
                    </div>
                    <div className="text-sm text-brand-blue-dark leading-relaxed">
                      {row.varB}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        id="kontakt"
        ref={addToRefs}
        className="py-20 md:py-32 bg-gradient-to-br from-brand-green-dark to-brand-teal text-white animated-element"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Bereit durchzustarten?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Wähle deine Variante und steig in die Energiewende ein:
            <br />
            1. Energieberatung selbst anbieten → Variante A<br />
            2. Empfehlungspartner werden → Variante B
          </p>
          <a
            href="mailto:kontakt@muenchnerenergieagentur.de"
            className="btn bg-white text-brand-teal focus:ring-white text-lg px-10 py-4 transition-all duration-200 hover:shadow-lg hover:scale-105 hover:bg-slate-100"
          >
            <MessageCircle className="w-5 h-5 mr-2 inline-block" /> Jetzt
            Kontakt aufnehmen
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        ref={addToRefs}
        className="py-8 bg-slate-800 text-slate-300 text-center animated-element"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Münchner Energie Agentur</p>
          <p className="text-sm mt-1">
            Truderinger Str. 271B, 81825 München |{" "}
            <a
              href="mailto:kontakt@muenchnerenergieagentur.de"
              className="hover:text-brand-green-light transition-colors"
            >
              kontakt@muenchnerenergieagentur.de
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
