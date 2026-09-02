/* ============================================================
   CLIENTS & PORTFOLIO — edit here.

   CLIENTS: To show a real logo image instead of the text chip,
   drop the file in /public/clients/ and set `logo` to its path,
   e.g. { name: "Safaricom", logo: "/clients/safaricom.png" }.
   If `logo` is omitted, a styled text chip is shown.

   WORK: `image` points to a file in /public/work/. To add a new
   project, drop a photo in /public/work/ and add a line here.
   ============================================================ */

import { BRAND } from "./site";

export interface Client {
  name: string;
  logo?: string; // e.g. "/clients/eabl.png"
}

export const CLIENTS: Client[] = [
  { name: "Samsung" },
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
  featured?: boolean;
}

export const WORK: Work[] = [
  { title: "Safaricom Activation Stage", cat: "Events", image: "/work/samsung-activation.jpg", tone: [BRAND.sky, BRAND.blue], featured: true },
  { title: "Samsung Galaxy Poster", cat: "Large Format", image: "/work/galaxy-poster.jpg", tone: [BRAND.ink, BRAND.sky] },
  { title: "Vehicle Branding", cat: "Large Format", image: "/work/vehicle-wrap.jpg", tone: [BRAND.ink, BRAND.blue] },
  { title: "Event Backdrop", cat: "Events", image: "/work/mothers-day-backdrop.jpg", tone: [BRAND.navy, BRAND.blue] },
  { title: "Safaricom Hook Activation", cat: "Events", image: "/work/samsung-hook-stand.jpg", tone: [BRAND.blue, BRAND.sky] },
  { title: "Roll-Up Banners", cat: "Large Format", image: "/work/rollup-banners.jpg", tone: [BRAND.blue, BRAND.navy] },
  { title: "Pull-Up Banner", cat: "Large Format", image: "/work/pullup-banner.jpg", tone: [BRAND.navy, BRAND.ink] },
  { title: "Galaxy AI Standees", cat: "Signage", image: "/work/galaxy-ai-standee.jpg", tone: [BRAND.ink, BRAND.blue] },
  { title: "Retail Standee", cat: "Signage", image: "/work/estore-standee.jpg", tone: [BRAND.navy, BRAND.sky] },
  { title: "Event Wayfinding Signage", cat: "Signage", image: "/work/wayfinding-stakes.jpg", tone: [BRAND.blue, BRAND.sky] },
  { title: "Event Registration Signage", cat: "Events", image: "/work/registration-signs.jpg", tone: [BRAND.navy, BRAND.blue] },
  { title: "Branded Apparel", cat: "Branding", image: "/work/apparel-tshirts.jpg", tone: [BRAND.navy, BRAND.sky] },
  { title: "Reflective Workwear", cat: "Branding", image: "/work/reflective-vests.jpg", tone: [BRAND.blue, BRAND.navy] },
  { title: "Large Format Production", cat: "Large Format", image: "/work/large-format-print.jpg", tone: [BRAND.ink, BRAND.sky] },
  { title: "Event Print Collateral", cat: "Printing", image: "/work/event-cards.jpg", tone: [BRAND.blue, BRAND.sky] },
];
