"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// -------------------------------------------------------------------------
// Imágenes de referencia (demo). Fotos libres de Unsplash usadas solo para
// maquetar el diseño; en producción se reemplazan por fotografía propia.
// -------------------------------------------------------------------------
const IMG = {
  hero: "https://images.unsplash.com/photo-1721761961411-8d9a578eb246?q=80&w=1400&auto=format&fit=crop",
  letras3d:
    "https://images.unsplash.com/photo-1517492973030-a02d282206f7?q=80&w=800&auto=format&fit=crop",
  cajasLuz:
    "https://images.unsplash.com/photo-1577980158219-1d4fb3ec8378?q=80&w=800&auto=format&fit=crop",
  neonLed:
    "https://images.unsplash.com/photo-1733261164483-e6782895d897?q=80&w=800&auto=format&fit=crop",
  acrilico:
    "https://images.unsplash.com/photo-1495069781661-dfeacdef0531?q=80&w=800&auto=format&fit=crop",
  pvc2d:
    "https://images.unsplash.com/photo-1740859743694-6c8632d400bc?q=80&w=800&auto=format&fit=crop",
  espejo:
    "https://images.unsplash.com/photo-1728534891052-cb507a3f7828?q=80&w=800&auto=format&fit=crop",
  carretas:
    "https://images.unsplash.com/photo-1757581560277-847ded6dce61?q=80&w=800&auto=format&fit=crop",
  vinil:
    "https://images.unsplash.com/photo-1564631271658-70dcdb7af99e?q=80&w=800&auto=format&fit=crop",
};

// -------------------------------------------------------------------------
// Datos de contacto (demo) que se muestran en el cuadrito de "Cotizar"
// -------------------------------------------------------------------------
const CONTACT = {
  telefono: "222 123 4567",
  whatsapp: "522221234567", // formato para wa.me, sin '+' ni espacios
  horario: "Lun - Sáb · 9:00 am a 7:00 pm",
  ubicacion: "Puebla, México",
};

function QuoteIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2 2 4-4m4.5-2.5v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h9.5L20 8.5z" />
    </svg>
  );
}

function CheckIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// -------------------------------------------------------------------------
// Cuadrito / modal que aparece al presionar cualquier botón "Cotizar"
// (mecanismo del botón de WhatsApp)
// -------------------------------------------------------------------------
function QuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Solo se monta en el cliente (createPortal necesita `document`, que no
  // existe durante el render en servidor).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Bloquea el scroll del fondo mientras el modal está abierto.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || !mounted) return null;

  const rows = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5c0-1.1.9-2 2-2h2.28a1 1 0 01.97.76l1 4a1 1 0 01-.29.99L7.4 10.3a13 13 0 006.3 6.3l1.55-1.56a1 1 0 01.99-.29l4 1a1 1 0 01.76.97V19a2 2 0 01-2 2h-1C9.16 21 3 14.84 3 7V5z" />
        </svg>
      ),
      label: "Teléfono",
      value: CONTACT.telefono,
      href: `tel:+${CONTACT.whatsapp}`,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.77.46 3.45 1.28 4.94L2 22l5.29-1.38a9.9 9.9 0 004.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.92C21.96 6.45 17.5 2 12.04 2z" />
        </svg>
      ),
      label: "WhatsApp",
      value: CONTACT.telefono,
      href: `https://wa.me/${CONTACT.whatsapp}`,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
        </svg>
      ),
      label: "Horario de atención",
      value: CONTACT.horario,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-6.5-7-11.5A7 7 0 0119 9.5C19 14.5 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      ),
      label: "Ubicación",
      value: CONTACT.ubicacion,
    },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 text-slate-500 hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xl font-extrabold leading-none">
            <span className="text-cyan-400">N</span>
            <span className="h-5 w-px bg-slate-700" />
            <span className="text-amber-400">D</span>
          </div>
          <span className="text-sm font-bold tracking-wide text-cyan-400">NEON DECOR</span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-white">Contáctanos para tu cotización</h3>
        <p className="mt-1 text-sm text-slate-400">
          Escríbenos o llámanos, con gusto te atendemos.
        </p>

        <div className="mt-5 space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          {rows.map((row) => {
            const content = (
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                  {row.icon}
                </span>
                <span>
                  <span className="block text-xs text-slate-500">{row.label}</span>
                  <span className="block text-sm font-semibold text-white">{row.value}</span>
                </span>
              </div>
            );
            return row.href ? (
              <a
                key={row.label}
                href={row.href}
                target={row.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="block rounded-lg transition-colors hover:bg-slate-800/60"
              >
                {content}
              </a>
            ) : (
              <div key={row.label}>{content}</div>
            );
          })}
        </div>

        <a
          href={`https://wa.me/${CONTACT.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-teal-400"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.77.46 3.45 1.28 4.94L2 22l5.29-1.38a9.9 9.9 0 004.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.92C21.96 6.45 17.5 2 12.04 2z" />
          </svg>
          Escribir por WhatsApp
        </a>
      </div>
    </div>,
    document.body
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const navLinks = [
    { label: "Productos", href: "#productos" },
    { label: "Nosotros", href: "#valor" },
  ];

  const heroFeatures = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 20L16 8m0 0l-2-2m2 2l2-2M4 20l2-6M4 20l6-2" />
        </svg>
      ),
      bold: "Diseño profesional",
      gray: "sin costo",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
        </svg>
      ),
      bold: "Entrega express",
      gray: "desde 4 días",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a4 4 0 01-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 015.4-5.4l-2-2-1 1 2 2-2 2-2-2 1-1z" />
        </svg>
      ),
      bold: "Instalación",
      gray: "incluida",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        </svg>
      ),
      bold: "Garantía",
      gray: "de 1 año",
    },
  ];

  const products = [
    { img: IMG.letras3d, title: "Letras 3D", subtitle: "con luz frontal o trasera" },
    { img: IMG.cajasLuz, title: "Cajas de luz", subtitle: "redondas y rectangulares" },
    { img: IMG.neonLed, title: "Neón LED", subtitle: "flexible" },
    { img: IMG.acrilico, title: "Letreros en acrílico", subtitle: "con luz" },
    { img: IMG.pvc2d, title: "Letras 2D", subtitle: "en PVC" },
    { img: IMG.espejo, title: "Espejos", subtitle: "instagrameables" },
    { img: IMG.carretas, title: "Cajas de luz", subtitle: "para carretas" },
    { img: IMG.vinil, title: "Letreros en vinil", subtitle: "impreso" },
  ];

  const valueItems = [
    { before: "Materiales de ", bold: "alta calidad", after: " y acabados profesionales" },
    { before: "Asesoría ", bold: "personalizada", after: " para el mejor resultado" },
    { before: "Precios justos y ", bold: "sin costos ocultos", after: "" },
    { before: "Atención rápida por ", bold: "WhatsApp", after: "" },
  ];

  return (
    <main className="min-h-screen bg-white font-sans text-white selection:bg-cyan-500/30">
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* ============================= */}
      {/* NAVBAR (oscuro) */}
      {/* ============================= */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          {/* Logo estilo N | D */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-2xl font-extrabold leading-none sm:text-3xl">
              <span className="text-cyan-400">N</span>
              <span className="h-7 w-px bg-slate-700" />
              <span className="text-amber-400">D</span>
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-wide text-cyan-400 sm:text-lg">
                NEON DECOR
              </p>
              <p className="text-[9px] font-medium tracking-[0.15em] text-slate-400 sm:text-[10px]">
                ANUNCIOS LUMINOSOS
              </p>
            </div>
          </div>

          {/* Acciones a la derecha */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => setQuoteOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-cyan-500 py-1.5 pl-1.5 pr-4 text-sm font-bold text-white transition-colors hover:bg-cyan-500/10 sm:pr-5"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-slate-950">
                <QuoteIcon className="h-4 w-4" />
              </span>
              Cotizar
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center text-white hover:text-cyan-400"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="border-t border-slate-800 bg-slate-950 px-5 py-4 sm:px-8">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-slate-300 hover:text-cyan-400"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ============================= */}
      {/* HERO (oscuro, foto a sangre a la derecha) */}
      {/* ============================= */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Imagen de fondo a la derecha con degradado hacia el navy (desktop) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[54%] lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMG.hero}
            alt="Anuncio luminoso instalado en fachada de negocio"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/30 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8 sm:pt-16 lg:pb-0 lg:pt-20">
          <div className="max-w-lg">
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Letreros luminosos que hacen{" "}
              <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.35)]">
                brillar
              </span>{" "}
              tu negocio
            </h1>

            <p className="mt-5 max-w-md text-slate-400">
              Diseñamos, fabricamos e instalamos anuncios luminosos de alta
              calidad que destacan tu marca y atraen más clientes.
            </p>
          </div>

          {/* Imagen visible solo en mobile/tablet */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMG.hero}
              alt="Anuncio luminoso instalado en fachada de negocio"
              className="h-56 w-full object-cover sm:h-72"
            />
          </div>

          {/* Fila de 4 features con ícono */}
          <div className="relative mt-10 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-slate-800/80 pt-8 sm:grid-cols-4 sm:gap-6 lg:mt-14">
            {heroFeatures.map((f) => (
              <div key={f.bold} className="flex items-center gap-3">
                <span className="flex-shrink-0 text-cyan-400">{f.icon}</span>
                <p className="text-sm leading-snug">
                  <span className="block font-bold text-white">{f.bold}</span>
                  <span className="text-slate-400">{f.gray}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* SECCIÓN DE PRODUCTOS (fondo blanco) */}
      {/* ============================= */}
      <section id="productos" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-cyan-500">
            Nuestros productos
          </p>
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Soluciones luminosas para{" "}
            <span className="text-cyan-500">cada negocio</span>
          </h2>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {products.map((p) => (
              <div
                key={p.title + p.subtitle}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={`${p.title} ${p.subtitle}`}
                  className="h-32 w-full object-cover sm:h-40"
                  loading="lazy"
                />
                <div className="bg-slate-950 px-3 py-3 sm:px-4">
                  <p className="text-sm font-bold text-white sm:text-base">{p.title}</p>
                  <p className="text-xs text-slate-400 sm:text-sm">{p.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ============================= */}
          {/* VALOR AGREGADO (caja oscura sobre fondo blanco) */}
          {/* ============================= */}
          <div className="mt-12 grid grid-cols-1 items-center gap-8 rounded-3xl bg-slate-950 p-8 sm:mt-16 md:grid-cols-[1fr_auto] md:p-10">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {valueItems.map((item) => (
                <div key={item.bold} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400 ring-1 ring-cyan-400/40">
                    <CheckIcon />
                  </span>
                  <span className="font-medium text-slate-200">
                    {item.before}
                    <span className="font-bold text-cyan-400">{item.bold}</span>
                    {item.after}
                  </span>
                </div>
              ))}
            </div>

            <svg
              viewBox="0 0 120 100"
              className="hidden h-28 w-32 flex-shrink-0 text-cyan-400 md:block"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 40L18 12h84l8 28" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 40c0 6 5 10 11 10s11-4 11-10c0 6 5 10 11 10s11-4 11-10c0 6 5 10 11 10s11-4 11-10c0 6 5 10 11 10s11-4 11-10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 50v38h88V50" />
              <rect x="50" y="62" width="20" height="26" rx="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* ============================= */}
          {/* CTA FINAL */}
          {/* ============================= */}
          <div className="mt-10 text-center sm:mt-12">
            <button
              type="button"
              onClick={() => setQuoteOpen(true)}
              className="relative inline-flex w-full items-center justify-center rounded-xl bg-teal-500 py-4 pl-7 pr-[4.25rem] text-base font-bold text-white shadow-md transition-colors hover:bg-teal-400 sm:w-auto sm:pr-20"
            >
              Solicitar una cotización
              <span className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-teal-600">
                <QuoteIcon className="h-5 w-5" />
              </span>
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
              <svg viewBox="0 0 24 24" fill="#25D366" className="h-4 w-4">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.77.46 3.45 1.28 4.94L2 22l5.29-1.38a9.9 9.9 0 004.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.92C21.96 6.45 17.5 2 12.04 2z" />
              </svg>
              Respuesta rápida por WhatsApp
            </div>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* FOOTER (oscuro) */}
      {/* ============================= */}
      <footer id="valor" className="border-t border-slate-800 bg-slate-950 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xl font-extrabold leading-none">
              <span className="text-cyan-400">N</span>
              <span className="h-5 w-px bg-slate-700" />
              <span className="text-amber-400">D</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-wide text-cyan-400">NEON DECOR</p>
              <p className="text-[10px] font-medium tracking-widest text-slate-500">
                ANUNCIOS LUMINOSOS
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-400">
            Transformamos espacios.{" "}
            <span className="font-semibold text-cyan-400">Hacemos brillar tu marca.</span>
          </p>
        </div>
      </footer>
    </main>
  );
}