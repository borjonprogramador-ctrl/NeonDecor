// -------------------------------------------------------------------------
// Datos del negocio en un solo lugar. Los usan la página, el footer, el
// aviso de privacidad, el JSON-LD para Google y el sitemap.
// Si cambia el teléfono, el horario o una red social, se edita SOLO aquí.
// -------------------------------------------------------------------------

// Dominio oficial. Se puede sobreescribir con NEXT_PUBLIC_SITE_URL.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.neonbajaensenada.com";

export const BUSINESS_NAME = "Neon Decor";

export const CONTACT = {
  telefono: "646 150 1420",
  tel: "+526461501420", // formato para enlaces tel:
  whatsapp: "526461501420", // formato para wa.me, sin '+' ni espacios
  email: "neonbajaensenada@gmail.com",
  horario: "Lun - Vie · 9:00 am a 6:00 pm",
  ciudad: "Ensenada",
  estado: "Baja California",
  ubicacion: "Ensenada, Baja California",
  cobertura: "Ensenada y alrededores", // TODO: confirmar zonas de instalación
};

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/neon_decor._",
  facebook: "https://www.facebook.com/share/1EtWEiZdQK/",
  tiktok: "https://www.tiktok.com/@eduardo.de.los.le", // cuenta oficial del negocio
};

// Link de WhatsApp con mensaje precargado.
export function waLink(message = "Hola, vi su página y quiero cotizar un letrero.") {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function waProductMessage(product: string) {
  return `Hola, me interesa: ${product}. Quiero cotizar.`;
}
