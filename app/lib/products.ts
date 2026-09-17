import fs from "node:fs";
import path from "node:path";

// -------------------------------------------------------------------------
// Este archivo usa `fs` y `path` (módulos de Node), así que SOLO debe
// importarse desde Server Components (como app/page.tsx).
//
// Si en algún componente de cliente necesitas el TIPO `Product` o
// `MediaItem`, impórtalo como "import type" (se borra en la compilación
// y no arrastra `fs`/`path` al navegador):
//   import type { Product, MediaItem } from "./lib/products";
// -------------------------------------------------------------------------

export type MediaType = "image" | "video";

export type MediaItem = {
  type: MediaType;
  src: string; // ruta pública, ej. "/products/CajaLuz1.jpg"
};

export type Product = {
  id: string;
  title: string;
  subtitle: string;
  prefix: string;
  media: MediaItem[];
};

// -------------------------------------------------------------------------
// Metadata "de negocio" de cada categoría: título visible, subtítulo y
// el prefijo de archivo que le corresponde. Esto SÍ se define a mano
// una sola vez (el nombre bonito no se puede sacar del nombre del
// archivo) — pero ya NO hace falta tocarlo cada vez que subes una foto
// o un video nuevo. Eso se detecta solo en getProducts(), más abajo.
//
// Si el cliente agrega una categoría nueva, aquí es el único lugar que
// hay que editar (una línea); las fotos/videos de esa categoría se
// detectan automáticamente en cuanto existan en public/products/.
// -------------------------------------------------------------------------
const PRODUCT_DEFINITIONS: Array<
  Pick<Product, "id" | "title" | "subtitle" | "prefix">
> = [
  { id: "caja-luz", title: "Caja de Luz", subtitle: "redonda o rectangular", prefix: "CajaLuz" },
  { id: "3d-aluminio", title: "Letras 3D en Aluminio", subtitle: "acabado metálico premium", prefix: "3Daluminio" },
  { id: "3d-acrilico", title: "Letras 3D en Acrílico", subtitle: "con luz frontal o trasera", prefix: "3Dacrilico" },
  { id: "acrilico", title: "Letras en Acrílico", subtitle: "corte preciso y color", prefix: "Acrilico" },
  { id: "2d-pvc", title: "Letras 2D en PVC", subtitle: "ligeras y económicas", prefix: "2dPVC" },
  { id: "neon-led", title: "Letrero en Neón Led", subtitle: "flexible y vibrante", prefix: "neonled" },
  { id: "circulares", title: "Cajas Circulares", subtitle: "diseño redondo iluminado", prefix: "circulares" },
  { id: "insta", title: "Espejo Instagramable", subtitle: "ideal para fotos", prefix: "insta" },
];

// Extensiones reconocidas. Para soportar otra (ej. ".mov" o ".png"
// que ya está, o ".gif"), solo se agrega aquí, no hay que tocar nada más.
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const VIDEO_EXTENSIONS = ["mp4"];
const ALL_EXTENSIONS = [...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS];

const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");

/**
 * Lee /public/products/ y arma, para cada producto definido arriba, la
 * lista de fotos/videos que existen AHORA MISMO en disco, ordenados por
 * su número. No importa cuántos haya, si faltan números en medio, o si
 * hay mezcla de fotos y videos: todo se detecta solo por el prefijo.
 *
 * Ejemplo: si en la carpeta hay
 *   CajaLuz1.jpg, CajaLuz2.jpg, CajaLuz5.mp4, CajaLuz6.jpg
 * el producto "Caja de Luz" recibe esos 4 elementos, en ese orden,
 * cada uno marcado como "image" o "video" según su extensión.
 */
export function getProducts(): Product[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(PRODUCTS_DIR);
  } catch {
    // La carpeta todavía no existe o está vacía: no truena la página,
    // simplemente cada producto queda con media: [].
    files = [];
  }

  return PRODUCT_DEFINITIONS.map((def) => {
    // Patrón: <prefijo exacto><número><.extensión>
    // Ej. prefix "CajaLuz" -> coincide con CajaLuz1.jpg, CajaLuz12.mp4...
    // pero NO con Acrilico1.jpg ni con 3Dacrilico1.jpg (prefijos distintos).
    const pattern = new RegExp(
      `^${escapeRegExp(def.prefix)}(\\d+)\\.(${ALL_EXTENSIONS.join("|")})$`,
      "i"
    );

    const media = files
      .map((file) => {
        const match = file.match(pattern);
        if (!match) return null;
        const order = parseInt(match[1], 10);
        const ext = match[2].toLowerCase();
        const type: MediaType = VIDEO_EXTENSIONS.includes(ext) ? "video" : "image";
        return { order, item: { type, src: `/products/${file}` } as MediaItem };
      })
      .filter((x): x is { order: number; item: MediaItem } => x !== null)
      .sort((a, b) => a.order - b.order)
      .map((x) => x.item);

    return { ...def, media };
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}