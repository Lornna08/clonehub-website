/* ============================================================
   CATALOGUE — the full Clone Hub service catalogue, by section.
   Each section: title, intro, list of items, and an image.
   Images live in /public/catalogue/ (PDF crops) or /public/work/
   (real project photos). Edit freely.
   ============================================================ */

export interface CatSection {
  id: string;
  title: string;
  intro: string;
  items: string[];
  image: string;
  imageAlt: string;
}

export const CATALOGUE: CatSection[] = [
  {
    id: "digital",
    title: "Digital Printing",
    intro: "Sharp, full-colour digital printing for everyday business essentials — short runs to bulk, quick turnaround.",
    items: ["Catalogues", "AGM Reports", "Magazines", "Posters", "Flyers", "Calendars", "Business Cards", "Labels", "Menus", "Table Talkers"],
    image: "/work/registration-signs.jpg",
    imageAlt: "Digital print collateral produced by Clone Hub",
  },
  {
    id: "large-format",
    title: "Large Format Printing",
    intro: "High-resolution large format for quality printing outcomes across a wide range of materials.",
    items: ["Banners", "Stickers", "One-Way Vision", "Satin", "Backlit", "Canvas", "Frosted Material", "Reflective"],
    image: "/work/large-format-print.jpg",
    imageAlt: "Large format printing production",
  },
  {
    id: "fabric-flag",
    title: "Fabric & Flag Printing",
    intro: "Portable, eye-catching fabric displays for events, activations and retail.",
    items: ["Teardrops", "Backdrops", "Telescopics", "Feather Banners", "Flags", "Backdrop Fabrics", "S-Stands"],
    image: "/work/samsung-activation.jpg",
    imageAlt: "Fabric and flag displays at a brand activation",
  },
  {
    id: "offset",
    title: "Offset Printing",
    intro: "Cost-effective offset printing for business stationery and bulk documents.",
    items: ["Receipt Books", "Invoices", "Delivery Notes", "LPOs", "Cash Sale Books", "Proforma", "Letterheads", "& more"],
    image: "/work/event-cards.jpg",
    imageAlt: "Offset printed business stationery",
  },
  {
    id: "labels",
    title: "Labels",
    intro: "Self-adhesive labels on paper or foil, matt or glossy — digital and offset printed.",
    items: ["Product Labels", "Bottle Labels", "Jar Labels", "Food Labels", "Paper Labels", "Foil Labels", "Matt & Gloss"],
    image: "/work/rollup-banners.jpg",
    imageAlt: "Printed product labels",
  },
  {
    id: "outdoor-signage",
    title: "Outdoor Signage",
    intro: "Storefront and roadside signage that gets your brand seen — from shopfronts to pylon signs.",
    items: ["Shop Signs", "3D & Channel Letters", "Illuminated Signs", "Pylon Signs", "Directional Signs", "Building Signage"],
    image: "/catalogue/outdoor-signage.jpg",
    imageAlt: "Outdoor signage installations",
  },
  {
    id: "indoor-signage",
    title: "Indoor Signage",
    intro: "Interior signage that finishes a space professionally — reception, wayfinding and feature walls.",
    items: ["Reception Signs", "Wall Branding", "Wayfinding", "Directional Signage", "3D Lettering", "Feature Walls"],
    image: "/catalogue/indoor-signage.jpg",
    imageAlt: "Indoor signage examples",
  },
  {
    id: "office-branding",
    title: "Office Branding",
    intro: "Turn your workspace into a branded environment — glass, walls, doors and reception.",
    items: ["Glass Frosting", "Wall Graphics", "Door Branding", "Reception Branding", "Window Graphics", "Feature Walls"],
    image: "/catalogue/office-branding.jpg",
    imageAlt: "Office branding installations",
  },
  {
    id: "promotional",
    title: "Promotional Items",
    intro: "Branded merchandise and corporate gifts that keep your brand in people's hands.",
    items: ["Mugs", "Umbrellas", "Caps", "Polo Shirts", "Backpacks", "Water Bottles", "Pens", "USB Drives", "Tote Bags"],
    image: "/work/reflective-vests.jpg",
    imageAlt: "Branded promotional items",
  },
  {
    id: "apparel",
    title: "Apparel Branding",
    intro: "Choose Clone Hub for quality apparel branding — embroidery, heat press and screen printing.",
    items: ["T-Shirts", "Polo Shirts", "Hoodies", "Caps", "Tote Bags", "Towels", "Embroidery", "Heat Press", "Screen Printing"],
    image: "/work/apparel-tshirts.jpg",
    imageAlt: "Branded apparel by Clone Hub",
  },
  {
    id: "branding-advertising",
    title: "Branding & Advertising",
    intro: "We're results-oriented. Award-winning creative is great, but tangible results are even better — we strive for both.",
    items: ["Pull-Up Banners", "Feather Flags", "Gazebos", "Exhibition Stands", "Elevator Wraps", "Wall Branding", "Core Values Walls"],
    image: "/work/galaxy-poster.jpg",
    imageAlt: "Branding and advertising campaign work",
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    intro: "We're creative, but smart too. We produce clever work but always keep the objective of each artwork top of mind.",
    items: ["Logo Design", "Branding Collateral", "Company Profiles", "Magazines", "Product Packaging", "Infographics", "E-Cards"],
    image: "/catalogue/graphic-design.jpg",
    imageAlt: "Graphic design services",
  },
];
