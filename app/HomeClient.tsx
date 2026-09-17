"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Product } from "./lib/products";

// -------------------------------------------------------------------------
// Foto del hero (demo, libre de Unsplash). Es una imagen remota, por eso
// usa <img> normal en vez de <Image /> de Next (no requiere configurar
// dominios remotos en next.config). Las fotos/videos de producto sí son
// locales y sí usan <Image />/<video> más abajo.
// -------------------------------------------------------------------------
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1721761961411-8d9a578eb246?q=80&w=1400&auto=format&fit=crop";

// -------------------------------------------------------------------------
// Datos de contacto (demo) que se muestran en el cuadrito de "Cotizar"
// -------------------------------------------------------------------------
const CONTACT = {
  telefono: "222 123 4567",
  whatsapp: "522221234567", // formato para wa.me, sin '+' ni espacios
  horario: "Lun - Sáb · 9:00 am a 7:00 pm",
  ubicacion: "Puebla, México",
};

// -------------------------------------------------------------------------
// REDES SOCIALES
// Reemplaza cada "#" por la URL real cuando la tengas. Para agregar una
// red nueva en el futuro, solo se añade otra línea aquí (ej. "youtube")
// y se usa SOCIAL_LINKS.youtube donde haga falta.
//
// Ejemplo de reemplazo:
//   instagram: "https://www.instagram.com/neondecor_mx"
// -------------------------------------------------------------------------
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/neon_decor._?stkn=MTVzMGV4eHF2bjFkaA%3D%3D", // TODO: pegar aquí el link real de Instagram
  facebook: "https://www.facebook.com/share/1EtWEiZdQK/", // TODO: pegar aquí el link real de Facebook
  tiktok: "https://www.tiktok.com/@eduardo.de.los.le?_r=1&_t=ZS-99n0hwIoxPA", // TODO: pegar aquí el link real de TikTok
};

// -------------------------------------------------------------------------
// Iconos reutilizables
// -------------------------------------------------------------------------
function CheckIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function PlayIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14 9h3V5.5h-3C11.79 5.5 10 7.29 10 9.5V12H8v3.5h2V22h3.5v-6.5H16l.5-3.5h-3V9.9c0-.5.4-.9.9-.9z" />
    </svg>
  );
}

function TikTokIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.5 2h-3v13.5a2.5 2.5 0 11-2.5-2.5c.17 0 .34.02.5.05V9.98a5.5 5.5 0 105.5 5.52V8.9a7.4 7.4 0 004.5 1.53V7.4A4.4 4.4 0 0116.5 3.9V2z" />
    </svg>
  );
}

// =========================================================================
// MODAL 1: Cuadrito de contacto que abren los botones "Cotizar"
// (sin cambios respecto a la versión anterior)
// =========================================================================
function QuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
        className="relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 text-slate-500 hover:text-white"
        >
          <CloseIcon />
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

// =========================================================================
// MODAL 2: Galería/Lightbox del producto
//
// CAMBIO CLAVE: ya no arma rutas a mano (prefix + índice). Recibe
// `product.media`, que ya viene resuelto desde el servidor con
// exactamente los archivos que existen en public/products/ — pueden
// ser 0, 3, 5, 12... y pueden ser fotos o videos mezclados.
// =========================================================================
function ProductGalleryModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // createPortal necesita `document`, que solo existe en el navegador.
  useEffect(() => setMounted(true), []);

  // Cada vez que se abre un producto nuevo, la galería arranca en el 1.
  useEffect(() => {
    setActiveIndex(0);
  }, [product?.id]);

  // Bloquea el scroll del fondo mientras el modal está abierto.
  useEffect(() => {
    if (!product) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [product]);

  const total = product?.media.length ?? 0;

  // Navegación circular: en el último elemento, "siguiente" regresa al
  // primero (y viceversa con "anterior").
  const goPrev = useCallback(() => {
    if (!total) return;
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    if (!total) return;
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  // Navegación con teclado: ← → para moverse, Esc para cerrar.
  useEffect(() => {
    if (!product) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, goPrev, goNext, onClose]);

  if (!product || !mounted) return null;

  const media = product.media;
  const active = media[activeIndex];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      {/* Botón cerrar, esquina superior derecha */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar galería"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/90 text-white ring-1 ring-slate-700 transition-colors hover:bg-cyan-500 hover:text-slate-950 sm:right-6 sm:top-6"
      >
        <CloseIcon className="h-6 w-6" />
      </button>

      {/* Contenedor central: detiene la propagación para que un clic
          dentro del modal no lo cierre (solo se cierra clicando el fondo
          oscuro o la "X"). */}
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col items-center overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título del producto */}
        <div className="mb-4 text-center">
          <p className="text-lg font-bold text-white sm:text-xl">{product.title}</p>
          <p className="text-sm text-slate-400">{product.subtitle}</p>
        </div>

        {media.length === 0 ? (
          // Todavía no hay archivos subidos para esta categoría: no
          // truena, muestra un aviso amigable en vez del visor.
          <div className="flex h-[42vh] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-6 text-center sm:h-[55vh]">
            <p className="text-sm text-slate-400">
              Todavía no hay fotos ni videos para esta categoría.
            </p>
            <p className="text-xs text-slate-600">
              Sube archivos a <code className="text-cyan-400">public/products/</code>{" "}
              que empiecen con <code className="text-cyan-400">{product.prefix}</code>{" "}
              (ej. <code className="text-cyan-400">{product.prefix}1.jpg</code>).
            </p>
          </div>
        ) : (
          <>
            {/* Elemento principal + flechas de navegación a los lados */}
            <div className="relative flex w-full items-center justify-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Anterior"
                className="z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-900/90 text-white ring-1 ring-slate-700 transition-colors hover:bg-cyan-500 hover:text-slate-950 sm:h-12 sm:w-12"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 sm:h-6 sm:w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* object-contain para no recortar (fotos/videos reales,
                  con proporciones variadas). Imagen -> next/image;
                  video -> <video> nativo con controles. */}
              <div className="relative h-[42vh] w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 sm:h-[55vh]">
                {active.type === "video" ? (
                  <video
                    key={active.src}
                    src={active.src}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Image
                    key={active.src}
                    src={active.src}
                    alt={`${product.title} - elemento ${activeIndex + 1} de ${media.length}`}
                    fill
                    sizes="(max-width: 768px) 90vw, 800px"
                    className="object-contain"
                    priority
                  />
                )}
              </div>

              <button
                type="button"
                onClick={goNext}
                aria-label="Siguiente"
                className="z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-900/90 text-white ring-1 ring-slate-700 transition-colors hover:bg-cyan-500 hover:text-slate-950 sm:h-12 sm:w-12"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 sm:h-6 sm:w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Contador "2 / 5" */}
            <p className="mt-3 text-sm font-medium text-slate-400">
              {activeIndex + 1} / {media.length}
            </p>

            {/* Miniaturas para saltar directo a cualquier elemento */}
            <div className="mt-4 flex max-w-full gap-2 overflow-x-auto px-2 pb-1">
              {media.map((m, i) => (
                <button
                  key={m.src}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Ver elemento ${i + 1}`}
                  className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-slate-900 transition-all sm:h-16 sm:w-16 ${
                    i === activeIndex
                      ? "border-cyan-400 opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  {m.type === "video" ? (
                    <>
                      <video src={m.src} muted preload="metadata" className="h-full w-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <PlayIcon className="h-5 w-5 text-white" />
                      </span>
                    </>
                  ) : (
                    <Image src={m.src} alt={`Miniatura ${i + 1}`} fill sizes="64px" className="object-cover" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

// =========================================================================
// PÁGINA PRINCIPAL (Client Component)
// Recibe `products` ya resuelto por el Server Component (app/page.tsx).
// =========================================================================
export default function HomeClient({ products }: { products: Product[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  // Guarda qué producto está abierto en la galería (null = galería cerrada)
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

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

  const valueItems = [
    { before: "Materiales de ", bold: "alta calidad", after: " y acabados profesionales" },
    { before: "Asesoría ", bold: "personalizada", after: " para el mejor resultado" },
    { before: "Precios justos y ", bold: "sin costos ocultos", after: "" },
    { before: "Atención rápida por ", bold: "WhatsApp", after: "" },
  ];

  return (
    <main className="min-h-screen bg-white font-sans text-white selection:bg-cyan-500/30">
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
      <ProductGalleryModal product={activeProduct} onClose={() => setActiveProduct(null)} />

      {/* ============================= */}
      {/* NAVBAR (oscuro) */}
      {/* ============================= */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex flex-shrink-0 items-center gap-1.5 text-2xl font-extrabold leading-none sm:text-3xl">
              <span className="text-cyan-400">N</span>
              <span className="h-7 w-px bg-slate-700" />
              <span className="text-amber-400">D</span>
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-base font-bold tracking-wide text-cyan-400 sm:text-lg">
                NEON DECOR
              </p>
              <p className="truncate text-[9px] font-medium tracking-[0.15em] text-slate-400 sm:text-[10px]">
                ANUNCIOS LUMINOSOS
              </p>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => setQuoteOpen(true)}
              className="inline-flex items-center justify-center rounded-full border-2 border-cyan-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-cyan-500/10"
            >
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
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[54%] lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMAGE}
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

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGE}
              alt="Anuncio luminoso instalado en fachada de negocio"
              className="h-56 w-full object-cover sm:h-72"
            />
          </div>

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
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-slate-500">
            Toca cualquier tarjeta para ver la galería completa de fotos y videos.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => {
              // Portada de la tarjeta: la primera FOTO disponible (una
              // imagen se puede miniaturizar con next/image; un video
              // no, así que si solo hay videos se usa uno como portada
              // reproducible en silencio).
              const coverImage = p.media.find((m) => m.type === "image");
              const coverVideo = !coverImage ? p.media.find((m) => m.type === "video") : undefined;

              return (
                // Cada tarjeta es un <button> que abre la galería de ESE
                // producto (le pasamos el objeto `p` completo, ya con su
                // `media` resuelto, a setActiveProduct).
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveProduct(p)}
                  className="group block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-md transition-all hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  <div className="relative h-32 w-full bg-slate-100 sm:h-40">
                    {coverImage ? (
                      <Image
                        src={coverImage.src}
                        alt={`${p.title} ${p.subtitle}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : coverVideo ? (
                      <video
                        src={coverVideo.src}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      // Categoría sin archivos todavía: placeholder neutro,
                      // no truena la página.
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
                          <path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2 12l4-4 3 3 4-5 3 4H6z" />
                        </svg>
                      </div>
                    )}

                    {/* Badge con el número real de elementos detectados */}
                    {p.media.length > 0 && (
                      <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                          <path d="M4 5a2 2 0 012-2h1.17a2 2 0 001.42-.59l.82-.82A2 2 0 0110.83 1h2.34a2 2 0 011.42.59l.82.82A2 2 0 0016.83 3H18a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8 3a4 4 0 100 8 4 4 0 000-8z" />
                        </svg>
                        {p.media.length}
                      </span>
                    )}
                  </div>
                  <div className="bg-slate-950 px-3 py-3 sm:px-4">
                    <p className="text-sm font-bold text-white sm:text-base">{p.title}</p>
                    <p className="text-xs text-slate-400 sm:text-sm">{p.subtitle}</p>
                  </div>
                </button>
              );
            })}
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
              className="inline-flex w-full items-center justify-center rounded-xl bg-teal-500 px-8 py-4 text-base font-bold text-white shadow-md transition-colors hover:bg-teal-400 sm:w-auto"
            >
              Solicitar una cotización
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
        <div className="mx-auto flex max-w-7xl flex-col flex-wrap items-center gap-6 px-5 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left">
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

          {/* Redes sociales — ver SOCIAL_LINKS al inicio del archivo */}
          <div className="flex flex-shrink-0 items-center gap-3">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-600 bg-slate-900 text-slate-300 transition-colors hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-600 bg-slate-900 text-slate-300 transition-colors hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-600 bg-slate-900 text-slate-300 transition-colors hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}