/* ============================================================
   SITE CONFIG — edit business details here in one place.
   Everything below flows into the whole website.
   ============================================================ */

export const SITE = {
  name: "Clone Hub Prints",
  shortName: "Clone Hub",
  tagline: "Design, Printing & Branding",
  contactPerson: "Erick Mathenge",
  role: "Graphic Designer",
  address: "Khoja Roundabout, Nairobi, Kenya",
  phone: "+254 717 892 694",
  phone2: "+254 748 846 781",
  whatsapp: "254717892694", // digits only, no + or spaces
  email: "ericmathenge254@gmail.com",
  // Used for SEO / links. Change to your real domain after you buy one.
  url: "https://clonehub.co.ke",
};

export const BRAND = {
  navy: "#1E2C86",
  blue: "#2E6BE6",
  sky: "#5BB8E8",
  ink: "#0B1220",
  slate: "#4A5568",
  mist: "#F4F7FB",
  line: "#E3E9F2",
};

export function waLink(text?: string) {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function emailLink(text: string) {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(
    "Quote request — Clone Hub"
  )}&body=${encodeURIComponent(text)}`;
}
