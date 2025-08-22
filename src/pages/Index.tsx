import React, { useState, useEffect, useRef } from "react";
import {
  Target,
  ListChecks,
  Handshake,
  MessageCircle,
  Menu,
  X,
  Mail,
  Phone,
  User,
  Send,
  Volume2,
} from "lucide-react";

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
  </svg>
);

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telefon: "",
    variante: "",
    nachricht: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [showAudioHint, setShowAudioHint] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);

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

  // Video autoplay logic
  useEffect(() => {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            // Video is visible, start autoplay after 2 seconds
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.play().then(() => {
                  setVideoStarted(true);
                  // Show audio hint after video starts
                  setTimeout(() => {
                    setShowAudioHint(true);
                  }, 1000);
                }).catch((error) => {
                  console.log('Autoplay was prevented by the browser:', error);
                  // Autoplay was prevented, which is normal behavior
                  // User can still manually play the video
                });
              }
            }, 2000);
            // Stop observing once we've triggered autoplay
            videoObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of video is visible
    );

    if (videoRef.current) {
      videoObserver.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        videoObserver.unobserve(videoRef.current);
      }
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

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous status
    setSubmitStatus({ type: null, message: '' });
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Ihre Nachricht wurde erfolgreich versendet!'
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          telefon: "",
          variante: "",
          nachricht: "",
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.errors ? result.errors.join(' ') : result.message || 'Es gab einen Fehler beim Versenden.'
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Es gab einen Fehler beim Versenden. Bitte versuchen Sie es später erneut.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppContact = () => {
    const message = "Hallo Stefan! Ich bin Kaminkehrer und interessiere mich für die Zusammenarbeit mit der Münchner Energie Agentur. Können wir uns unterhalten?";
    const whatsappLink = `https://wa.me/4917620329486?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  const handleVideoClick = () => {
    if (videoRef.current && showAudioHint) {
      setShowAudioHint(false);
      videoRef.current.muted = false;
    }
  };

  const handleVideoInteraction = () => {
    setShowAudioHint(false);
  };

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
            className="flex justify-center mb-12 animate-fade-in-up relative"
            style={{ animationDelay: "0.45s" }}
          >
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full max-w-64 rounded-lg shadow-lg border-white border-4"
                controls
                muted
                playsInline
                preload="metadata"
                onClick={handleVideoClick}
                onPlay={handleVideoInteraction}
                onPause={handleVideoInteraction}
                onVolumeChange={handleVideoInteraction}
              >
                <source src="/videos/stefan.mp4" type="video/mp4" />
                Ihr Browser unterstützt das Video-Element nicht.
              </video>
              
              {/* Audio Hint Overlay */}
              {showAudioHint && videoStarted && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg cursor-pointer transition-opacity duration-300 hover:bg-black/60"
                  onClick={handleVideoClick}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center shadow-xl border border-white/20 animate-pulse">
                    <Volume2 className="w-8 h-8 mx-auto mb-2 text-brand-teal" />
                    <p className="text-brand-teal font-semibold text-sm">
                      🔊 Klicken für Ton
                    </p>
                  </div>
                </div>
              )}
            </div>
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

      {/* Contact Form Section */}
      <section
        id="kontakt"
        ref={addToRefs}
        className="py-20 md:py-32 bg-gradient-to-br from-brand-green-dark to-brand-teal text-white animated-element"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Bereit durchzustarten?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Wähle deine Variante und steig in die Energiewende ein.
              Kontaktiere mich jetzt!
            </p>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={handleFormSubmit}
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-white/20"
            >
              {/* Status Messages */}
              {submitStatus.type && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-100 border-green-400 text-green-700' 
                    : 'bg-red-100 border-red-400 text-red-700'
                }`}>
                  {submitStatus.message}
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2 flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                    placeholder="Dein Name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2 flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                    placeholder="deine@email.de"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="telefon"
                    className="block text-sm font-medium mb-2 flex items-center"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Telefonnummer *
                  </label>
                  <input
                    type="tel"
                    id="telefon"
                    name="telefon"
                    required
                    value={formData.telefon}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                    placeholder="0123 456789"
                  />
                </div>

                {/* Variant Selection */}
                <div>
                  <label
                    htmlFor="variante"
                    className="block text-sm font-medium mb-2 flex items-center"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Gewünschte Variante *
                  </label>
                  <select
                    id="variante"
                    name="variante"
                    required
                    value={formData.variante}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  >
                    <option value="" className="text-slate-800">
                      Bitte auswählen
                    </option>
                    <option value="Variante A" className="text-slate-800">
                      Variante A: Energieberatung selbst anbieten
                    </option>
                    <option value="Variante B" className="text-slate-800">
                      Variante B: Empfehlungspartner werden
                    </option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="mt-6">
                <label
                  htmlFor="nachricht"
                  className="block text-sm font-medium mb-2 flex items-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Deine Nachricht
                </label>
                <textarea
                  id="nachricht"
                  name="nachricht"
                  rows={4}
                  value={formData.nachricht}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all resize-vertical"
                  placeholder="Teile mir deine Fragen oder Anmerkungen mit..."
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="mt-8 text-center space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn bg-white text-brand-teal hover:bg-slate-100 focus:ring-white text-lg px-10 py-4 transition-all duration-200 hover:shadow-lg hover:scale-105 inline-flex items-center w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Nachricht senden
                    </>
                  )}
                </button>
                
                <div className="flex items-center justify-center">
                  <div className="flex-1 border-t border-white/30"></div>
                  <span className="px-4 text-white/70 text-sm">oder</span>
                  <div className="flex-1 border-t border-white/30"></div>
                </div>
                
                <button
                  type="button"
                  onClick={handleWhatsAppContact}
                  disabled={isSubmitting}
                  className="btn bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 text-lg px-10 py-4 transition-all duration-200 hover:shadow-lg hover:scale-105 inline-flex items-center w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <WhatsAppIcon className="w-5 h-5 mr-2" />
                  Schreib mir auf WhatsApp
                </button>
              </div>
            </form>
          </div>
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
              href="mailto:sgw@muenchnerenergieagentur.de"
              className="hover:text-brand-green-light transition-colors"
            >
              sgw@muenchnerenergieagentur.de
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
