"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import type { Product } from "./lib/products";
import { CONTACT, SOCIAL_LINKS, waLink, waProductMessage } from "./lib/site";
import { ClientsStrip, HowItWorks, QuoteRequirements, Testimonials } from "./components/Sections";

// -------------------------------------------------------------------------
// Foto del hero. Archivo local: colócalo en public/presentacion.jpg
// (Next.js sirve cualquier archivo de public/ desde la raíz del sitio,
// por eso la ruta aquí es "/presentacion.jpg").
// -------------------------------------------------------------------------
const HERO_IMAGE = "/presentacion.jpg";

// Datos de contacto y redes: ver app/lib/site.ts

// Registra un evento en Vercel Analytics (clics a WhatsApp, llamadas, etc.)
function trackEvent(name: string, props?: Record<string, string>) {
  try {
    track(name, props);
  } catch {
    // Analytics nunca debe romper la página.
  }
}

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.77.46 3.45 1.28 4.94L2 22l5.29-1.38a9.9 9.9 0 004.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.92C21.96 6.45 17.5 2 12.04 2z" />
    </svg>
  );
}

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
// MODAL 1: Mini formulario de cotización (abre el botón "Cotizar").
// No guarda nada: arma el mensaje y lo abre en WhatsApp ya escrito, para
// que el negocio reciba desde el primer mensaje los datos para cotizar.
// =========================================================================
const LOGO_OPTIONS = ["Sí, tengo logo", "No, necesito diseño", "No sé todavía"];

function QuoteModal({
  open,
  onClose,
  productTitles,
}: {
  open: boolean;
  onClose: () => void;
  productTitles: string[];
}) {
  const [tipo, setTipo] = useState("");
  const [medidas, setMedidas] = useState("");
  const [logo, setLogo] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  // Solo se abre por un clic, así que aquí `document` ya existe
  // (en el servidor `open` siempre es false).
  if (!open) return null;

  const lines = ["Hola, vi su página y quiero cotizar un letrero."];
  if (tipo) lines.push(`• Tipo: ${tipo}`);
  if (medidas.trim()) lines.push(`• Medidas aprox.: ${medidas.trim()}`);
  if (logo) lines.push(`• Logo: ${logo}`);
  if (ubicacion.trim()) lines.push(`• Ubicación: ${ubicacion.trim()}`);
  const href = waLink(lines.join("\n"));

  const fieldClass =
    "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        className="relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          autoFocus
          className="absolute right-4 top-4 text-slate-500 hover:text-white"
        >
          <CloseIcon />
        </button>

        <h3 id="quote-title" className="pr-8 text-lg font-bold text-white">
          Cotiza tu letrero
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Llena lo que sepas y te lo enviamos por WhatsApp. Todo es opcional.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block text-xs font-semibold text-slate-300">
            Tipo de letrero
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={fieldClass}>
              <option value="">Elige uno</option>
              {productTitles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="No sé, quiero asesoría">No sé, quiero asesoría</option>
            </select>
          </label>

          <label className="block text-xs font-semibold text-slate-300">
            Medidas aproximadas
            <input
              type="text"
              value={medidas}
              onChange={(e) => setMedidas(e.target.value)}
              placeholder="Ej. 2 m de largo x 50 cm de alto"
              className={fieldClass}
            />
          </label>

          <fieldset>
            <legend className="text-xs font-semibold text-slate-300">¿Tienes logo?</legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {LOGO_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setLogo(logo === opt ? "" : opt)}
                  aria-pressed={logo === opt}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    logo === opt
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block text-xs font-semibold text-slate-300">
            ¿Dónde se instalaría?
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="Colonia o zona"
              className={fieldClass}
            />
          </label>
        </div>

        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("whatsapp_click", { origen: "formulario", producto: tipo || "sin elegir" })}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-teal-400"
        >
          <WhatsAppIcon />
          Enviar por WhatsApp
        </a>

        <div className="mt-5 space-y-1 border-t border-slate-800 pt-4 text-center text-xs text-slate-400">
          <p>
            ¿Prefieres llamar?{" "}
            <a
              href={`tel:${CONTACT.tel}`}
              onClick={() => trackEvent("call_click", { origen: "formulario" })}
              className="font-semibold text-cyan-400 hover:underline"
            >
              {CONTACT.telefono}
            </a>
          </p>
          <p>{CONTACT.horario}</p>
          <p>{CONTACT.ubicacion}</p>
        </div>
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
  // Arranca en el elemento 1. Al cambiar de producto, el componente se
  // vuelve a montar (key={product.id} en HomeClient) y reinicia solo.
  const [activeIndex, setActiveIndex] = useState(0);

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

  // Solo hay producto después de un clic, así que `document` ya existe.
  if (!product) return null;

  const media = product.media;
  const active = media[activeIndex];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-title"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      {/* Botón cerrar, esquina superior derecha */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar galería"
        autoFocus
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
          <p id="gallery-title" className="text-lg font-bold text-white sm:text-xl">
            {product.title}
          </p>
          <p className="text-sm text-slate-400">{product.subtitle}</p>
          <a
            href={waLink(waProductMessage(product.title))}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("whatsapp_click", { origen: "galeria", producto: product.title })}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-teal-500 px-5 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-teal-400"
          >
            <WhatsAppIcon />
            Cotizar este por WhatsApp
          </a>
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
                    loading="eager"
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
                      {/* "#t=0.1" hace que Safari/iPhone muestre un cuadro
                          del video como portada en vez de un cuadro negro. */}
                      <video
                        src={`${m.src}#t=0.1`}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
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

  // El menú móvil se cierra con Escape o al hacer scroll.
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", close, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", close);
    };
  }, [menuOpen]);

  const closeQuote = useCallback(() => setQuoteOpen(false), []);
  const closeGallery = useCallback(() => setActiveProduct(null), []);

  function openQuote(origen: string) {
    setQuoteOpen(true);
    trackEvent("cotizar_abierto", { origen });
  }

  function openGallery(p: Product) {
    setActiveProduct(p);
    trackEvent("galeria_abierta", { producto: p.title });
  }

  const navLinks = [
    { label: "Productos", href: "#productos" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Por qué elegirnos", href: "#valor" },
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
      bold: "Entrega",
      gray: "desde 4 días hábiles",
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
      gray: "de hasta 1 año",
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
      <QuoteModal
        open={quoteOpen}
        onClose={closeQuote}
        productTitles={products.map((p) => p.title)}
      />
      <ProductGalleryModal key={activeProduct?.id ?? "cerrada"} product={activeProduct} onClose={closeGallery} />

      {/* Botón flotante de WhatsApp — solo móvil/tablet */}
      <a
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Cotizar por WhatsApp"
        onClick={() => trackEvent("whatsapp_click", { origen: "flotante" })}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform hover:scale-105 lg:hidden"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>

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
            {/* Links de navegación en línea — solo escritorio (lg+) */}
            <div className="hidden items-center gap-5 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-cyan-400"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Redes sociales — solo en pantallas anchas (xl+). En las
                demás viven en la fila de abajo del navbar y en el footer. */}
            <div className="hidden items-center gap-2 xl:flex">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-cyan-400 hover:text-cyan-400"
              >
                <InstagramIcon className="h-3.5 w-3.5" />
                Instagram
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-cyan-400 hover:text-cyan-400"
              >
                <FacebookIcon className="h-3.5 w-3.5" />
                Facebook
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-cyan-400 hover:text-cyan-400"
              >
                <TikTokIcon className="h-3.5 w-3.5" />
                TikTok
              </a>
            </div>

            <button
              type="button"
              onClick={() => openQuote("header")}
              className="inline-flex items-center justify-center rounded-full border-2 border-cyan-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-cyan-500/10"
            >
              Cotizar
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
              className="flex h-9 w-9 items-center justify-center text-white hover:text-cyan-400 lg:hidden"
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
          <div id="menu-movil" className="border-t border-slate-800 bg-slate-950 px-5 py-4 sm:px-8 lg:hidden">
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
      {/* REDES SOCIALES — SOLO MÓVIL/TABLET */}
      {/* En escritorio no se muestra esta fila; las redes del navbar de desktop
          siguen siendo las únicas visibles arriba. En móvil/tablet aparecen
          directamente debajo del navbar sin depender del menú hamburguesa. */}
      {/* ============================= */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-800 bg-slate-950 px-4 py-2.5 xl:hidden">
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 transition-colors hover:border-cyan-400 hover:text-cyan-400"
        >
          <InstagramIcon className="h-3.5 w-3.5" />
          Instagram
        </a>
        <a
          href={SOCIAL_LINKS.facebook}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 transition-colors hover:border-cyan-400 hover:text-cyan-400"
        >
          <FacebookIcon className="h-3.5 w-3.5" />
          Facebook
        </a>
        <a
          href={SOCIAL_LINKS.tiktok}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 transition-colors hover:border-cyan-400 hover:text-cyan-400"
        >
          <TikTokIcon className="h-3.5 w-3.5" />
          TikTok
        </a>
      </div>

      {/* ============================= */}
      {/* HERO (oscuro, foto a sangre a la derecha) */}
      {/* ============================= */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8 sm:pt-16 lg:pb-8 lg:pt-20">
          {/* Envoltorio relativo SOLO para el bloque de texto: así la
              imagen de fondo (abajo) se posiciona contra la altura real
              del título+párrafo, no contra toda la sección (que incluye
              la fila de features). Antes usaba inset-y-0 sobre la sección
              completa, lo que estiraba la imagen a una caja demasiado
              alta y angosta y la recortaba mal. */}
          <div className="relative">
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

              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 flex-shrink-0 text-cyan-400" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-6.5-7-11.5A7 7 0 0119 9.5C19 14.5 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
                {CONTACT.ciudad}, B.C. · Instalamos en {CONTACT.cobertura}
              </p>

              <button
                type="button"
                onClick={() => openQuote("hero")}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-teal-400"
              >
                <WhatsAppIcon />
                Cotizar mi letrero
              </button>
            </div>

            {/* Foto del hero: una sola imagen. En móvil/tablet va debajo del
                texto como tarjeta; en escritorio (lg+) se posiciona a sangre
                a la derecha. */}
            <div className="relative mt-8 h-56 overflow-hidden rounded-2xl border border-slate-800 sm:h-72 lg:pointer-events-none lg:absolute lg:-inset-y-8 lg:right-0 lg:mt-0 lg:h-auto lg:w-[54%] lg:rounded-none lg:border-0">
              <Image
                src={HERO_IMAGE}
                alt="Letrero luminoso RUTA 400 instalado por Neon Decor"
                fill
                preload
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover object-center"
              />
              {/* Degradado suave hacia el texto, solo en el borde izquierdo
                  para no tapar el letrero. */}
              <div className="absolute inset-y-0 left-0 hidden w-8 bg-gradient-to-r from-slate-950 to-transparent lg:block" />
            </div>
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
                  onClick={() => openGallery(p)}
                  aria-label={`Ver galería: ${p.title} ${p.subtitle}`}
                  className="group flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-md transition-all hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  <div className="relative h-32 w-full flex-shrink-0 bg-slate-100 sm:h-40">
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
                        src={`${coverVideo.src}#t=0.1`}
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
                  <div className="flex flex-1 flex-col justify-center bg-slate-950 px-3 py-3 sm:px-4">
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
          <div
            id="valor"
            className="mt-12 grid scroll-mt-28 grid-cols-1 items-center gap-8 rounded-3xl bg-slate-950 p-8 sm:mt-16 md:grid-cols-[1fr_auto] md:p-10"
          >
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

          <ClientsStrip />
          <Testimonials />
          <HowItWorks />
          <QuoteRequirements />

          {/* ============================= */}
          {/* CTA FINAL */}
          {/* ============================= */}
          <div className="mt-10 text-center sm:mt-12">
            <button
              type="button"
              onClick={() => openQuote("final")}
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
      <footer className="border-t border-slate-800 bg-slate-950 pb-24 pt-10 lg:pb-8">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 md:grid-cols-3">
          {/* Marca + redes */}
          <div>
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
            <p className="mt-4 text-sm text-slate-400">
              Transformamos espacios.{" "}
              <span className="font-semibold text-cyan-400">Hacemos brillar tu marca.</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-cyan-400 hover:text-cyan-400"
              >
                <InstagramIcon className="h-4 w-4" />
                Instagram
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-cyan-400 hover:text-cyan-400"
              >
                <FacebookIcon className="h-4 w-4" />
                Facebook
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-cyan-400 hover:text-cyan-400"
              >
                <TikTokIcon className="h-4 w-4" />
                TikTok
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Contacto</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { origen: "footer" })}
                  className="hover:text-cyan-400"
                >
                  WhatsApp: {CONTACT.telefono}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.tel}`}
                  onClick={() => trackEvent("call_click", { origen: "footer" })}
                  className="hover:text-cyan-400"
                >
                  Teléfono: {CONTACT.telefono}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="break-all hover:text-cyan-400">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Horario y ubicación */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Horario y ubicación
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>{CONTACT.horario}</li>
              <li>{CONTACT.ubicacion}</li>
              <li>Instalamos en {CONTACT.cobertura}</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center gap-2 border-t border-slate-800 px-5 pt-6 text-xs text-slate-500 sm:flex-row sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Neon Decor. Todos los derechos reservados.</p>
          <Link href="/aviso-de-privacidad" className="hover:text-cyan-400">
            Aviso de privacidad
          </Link>
        </div>
      </footer>
    </main>
  );
}