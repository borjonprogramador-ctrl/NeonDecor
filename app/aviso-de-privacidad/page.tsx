import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS_NAME, CONTACT } from "../lib/site";

export const metadata: Metadata = {
  title: "Aviso de privacidad | Neon Decor",
  description: "Cómo Neon Decor trata los datos personales de quienes nos contactan.",
  alternates: { canonical: "/aviso-de-privacidad" },
};

// Texto general. Recomendable que el negocio lo revise con un contador o
// abogado si después empieza a guardar datos (formularios, CRM, etc.).
export default function AvisoDePrivacidad() {
  return (
    <main className="min-h-screen bg-white px-5 py-12 text-slate-700 sm:px-8">
      <article className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm font-semibold text-cyan-600 hover:underline">
          ← Volver al inicio
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
          Aviso de privacidad
        </h1>
        <p className="mt-2 text-sm text-slate-500">Última actualización: noviembre de 2026</p>

        <div className="mt-8 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900">Responsable</h2>
            <p className="mt-2">
              {BUSINESS_NAME}, con domicilio en {CONTACT.ubicacion}, México, es responsable del
              tratamiento de los datos personales que nos compartas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">Qué datos recabamos</h2>
            <p className="mt-2">
              Este sitio no guarda formularios ni datos personales. Cuando nos contactas por
              WhatsApp, teléfono o correo, recibimos los datos que tú decides enviarnos: nombre,
              número de teléfono y los detalles de tu proyecto (medidas, logo, ubicación de
              instalación).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">Para qué los usamos</h2>
            <p className="mt-2">
              Únicamente para responderte, preparar tu cotización, diseñar, fabricar e instalar tu
              letrero, y darte seguimiento y garantía. No vendemos ni compartimos tus datos con
              terceros con fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">Estadísticas del sitio</h2>
            <p className="mt-2">
              Usamos Vercel Web Analytics para contar visitas y clics de forma anónima. No usa
              cookies ni nos permite identificarte.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">Tus derechos</h2>
            <p className="mt-2">
              Puedes pedir acceder a tus datos, corregirlos, cancelarlos u oponerte a su uso
              escribiéndonos a{" "}
              <a href={`mailto:${CONTACT.email}`} className="font-semibold text-cyan-600 hover:underline">
                {CONTACT.email}
              </a>{" "}
              o al WhatsApp {CONTACT.telefono}.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">Cambios a este aviso</h2>
            <p className="mt-2">
              Cualquier cambio se publicará en esta misma página.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
