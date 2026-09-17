import HomeClient from "./HomeClient";
import { getProducts } from "./lib/products";

// -------------------------------------------------------------------------
// Server Component (SIN "use client"): corre en el servidor / al hacer
// build. Aquí es donde se lee la carpeta public/products/ con
// getProducts() y se arma el catálogo ya resuelto (qué fotos y videos
// existen de verdad para cada categoría).
//
// Ese catálogo se le pasa como prop a HomeClient, que es quien maneja
// toda la parte interactiva (menús, modales, clics, useState, etc.) —
// eso sí necesita ser un Client Component, por eso vive en otro archivo.
// -------------------------------------------------------------------------
export default function Page() {
  const products = getProducts();

  return <HomeClient products={products} />;
}