/* ============================================================
   CLIENTS & PORTFOLIO — edit here.

   CLIENTS: To show a real logo image instead of the text chip,
   drop the file in /public/clients/ and set `logo` to its path,
   e.g. { name: "Safaricom", logo: "/clients/safaricom.png" }.
   If `logo` is omitted, a styled text chip is shown.

   WORK: To use a real project photo, drop it in /public/work/
   and set `image` to its path, e.g. image: "/work/backdrop.jpg".
   If `image` is omitted, a branded placeholder tile is shown.
   ============================================================ */

import { BRAND } from "./site";

export interface Client {
  name: string;
  logo?: string; // e.g. "/clients/eabl.png"
}

export const CLIENTS: Client[] = [
  { name: "EABL" },
  { name: "Safaricom" },
  { name: "KCB Bank" },
  { name: "KWAL" },
  { name: "Bidco" },
  { name: "GeoPoll" },
  { name: "Wowtek" },
];

export interface Work {
  title: string;
  cat: string;
  image?: string; // e.g. "/work/vehicle-wrap.jpg"
  tone: [string, string]; // fallback gradient if no image
}

export const WORK: Work[] = [
  { title: "Corporate Event Backdrop", cat: "Events", tone: [BRAND.navy, BRAND.blue] },
  { title: "Retail Vehicle Wrap", cat: "Large Format", tone: [BRAND.ink, BRAND.sky] },
  { title: "Premium Business Cards", cat: "Printing", tone: [BRAND.blue, BRAND.sky] },
  { title: "Reception Wall Branding", cat: "Corporate", tone: [BRAND.navy, BRAND.ink] },
  { title: "Exhibition Stand", cat: "Events", tone: [BRAND.sky, BRAND.blue] },
  { title: "Product Packaging", cat: "Packaging", tone: [BRAND.blue, BRAND.navy] },
  { title: "Illuminated Shop Sign", cat: "Signage", tone: [BRAND.ink, BRAND.blue] },
  { title: "Branded Apparel Run", cat: "Branding", tone: [BRAND.navy, BRAND.sky] },
];
