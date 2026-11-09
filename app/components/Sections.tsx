// -------------------------------------------------------------------------
// Secciones de contenido de la página (sin interacción, sin hooks).
// -------------------------------------------------------------------------

// Negocios que aparecen en las fotos de trabajos instalados.
// Para agregar o quitar uno, solo se edita esta lista.
const CLIENTS = ["Ruta 400", "Florentino", "Via Dolce", "Glitter Bar", "Rossma"];

// Testimonios REALES de clientes. Mientras la lista esté vacía, la sección
// no se muestra. Formato:
//   { quote: "Quedó increíble, muy puntuales.", name: "Juan Pérez", business: "Ruta 400" },
// TODO: pedir 2 o 3 comentarios reales a clientes (o copiarlos de reseñas de Google).
const TESTIMONIALS: { quote: string; name: string; business?: string }[] = [];

const STEPS = [
  { title: "Cotiza por WhatsApp", text: "Cuéntanos qué letrero necesitas y te respondemos rápido." },
  { title: "Diseño sin costo", text: "Te mandamos una propuesta visual de cómo quedará." },
  { title: "Aprobación", text: "Ajustamos lo que haga falta hasta que te guste." },
  { title: "Fabricación", text: "Lo fabricamos a tu medida, desde 4 días hábiles." },
  { title: "Instalación", text: "Lo instalamos funcionando, con garantía de hasta 1 año." },
];

const REQUIREMENTS = [
  { title: "Medidas aproximadas", text: "Largo y alto del espacio donde irá el letrero." },
  { title: "Tu logo o idea", text: "Si no tienes logo, te ayudamos a diseñarlo." },
  { title: "Tipo de letrero", text: "Si no sabes cuál, te asesoramos." },
  { title: "Ubicación", text: "Dónde se instalará y si es interior o exterior." },
];

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: React.ReactNode }) {
  return (
    <>
      <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-cyan-500">{eyebrow}</p>
      <h2 className="mt-2 text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
    </>
  );
}

export function ClientsStrip() {
  return (
    <div className="mt-14 sm:mt-20">
      <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        Negocios que ya brillan con nosotros
      </p>
      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {CLIENTS.map((name) => (
          <li key={name} className="text-lg font-extrabold uppercase tracking-wide text-slate-400 sm:text-xl">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;
  return (
    <div className="mt-14 sm:mt-20">
      <SectionHeading eyebrow="Testimonios" title="Lo que dicen nuestros clientes" />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <blockquote className="text-slate-700">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm font-bold text-slate-900">
              {t.name}
              {t.business && <span className="font-normal text-slate-500"> · {t.business}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <div id="como-funciona" className="mt-14 scroll-mt-28 sm:mt-20">
      <SectionHeading
        eyebrow="Cómo funciona"
        title={
          <>
            De la idea a tu fachada en <span className="text-cyan-500">5 pasos</span>
          </>
        }
      />
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block lg:p-5"
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-cyan-400">
              {i + 1}
            </span>
            <div>
              <p className="font-bold text-slate-900 lg:mt-3">{step.title}</p>
              <p className="mt-1 text-sm text-slate-500">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function QuoteRequirements() {
  return (
    <div className="mt-14 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:mt-20 sm:p-10">
      <SectionHeading eyebrow="Antes de cotizar" title="Para cotizarte rápido necesitamos" />
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {REQUIREMENTS.map((r) => (
          <li key={r.title} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 ring-1 ring-cyan-500/40">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>
              <span className="block font-bold text-slate-900">{r.title}</span>
              <span className="block text-sm text-slate-500">{r.text}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-center text-sm text-slate-500">
        ¿No tienes todo? No pasa nada, escríbenos y te guiamos.
      </p>
    </div>
  );
}
