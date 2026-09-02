/* ============================================================
   SERVICE CATALOG — add / edit / remove services here.
   To add a service: copy a line, change the name, category and blurb.
   Categories must match an id in CATEGORIES below.
   ============================================================ */

import {
  Printer, Megaphone, PartyPopper, Building2, Shirt,
  PenTool, SignpostBig, Package,
} from "lucide-react";

export type CategoryId =
  | "printing" | "large-format" | "events" | "corporate"
  | "branding" | "design" | "signage" | "packaging";

export interface Category {
  id: CategoryId;
  name: string;
  icon: any;
}

export interface Service {
  name: string;
  category: CategoryId;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { id: "printing", name: "Printing", icon: Printer },
  { id: "large-format", name: "Large Format", icon: Megaphone },
  { id: "events", name: "Events", icon: PartyPopper },
  { id: "corporate", name: "Corporate", icon: Building2 },
  { id: "branding", name: "Promotional", icon: Shirt },
  { id: "design", name: "Design", icon: PenTool },
  { id: "signage", name: "Signage", icon: SignpostBig },
  { id: "packaging", name: "Packaging", icon: Package },
];

const S = (name: string, category: CategoryId, blurb: string): Service => ({ name, category, blurb });

export const SERVICES: Service[] = [
  // PRINTING
  S("Business Cards", "printing", "Standard and premium finishes, single or double-sided."),
  S("Premium Business Cards", "printing", "Soft-touch, spot UV and foiled cards that get noticed."),
  S("Flyers & Leaflets", "printing", "Short runs to bulk — sharp colour, fast turnaround."),
  S("Brochures & Booklets", "printing", "Folded, stapled or bound multi-page documents."),
  S("Company Profiles", "printing", "Polished corporate profiles printed to spec."),
  S("Catalogues & Magazines", "printing", "Perfect-bound and saddle-stitched publications."),
  S("Calendars", "printing", "Wall, desk and custom branded calendars."),
  S("Certificates", "printing", "Award and completion certificates on quality stock."),
  S("Menus & Restaurant Menus", "printing", "Laminated, folded and premium menu printing."),
  S("Wedding & Event Invitations", "printing", "Elegant invitations with premium finishing."),
  S("Funeral & Church Programs", "printing", "Dignified programs prepared with care."),
  S("Notebooks & Diaries", "printing", "Branded notebooks, journals and diaries."),
  S("Receipt & Invoice Books", "printing", "Carbonless NCR books, numbered and bound."),
  S("Letterheads & Envelopes", "printing", "Matching corporate stationery sets."),
  S("Stickers & Labels", "printing", "Product, bottle and packaging labels, any shape."),
  S("Posters (A5–A1)", "printing", "Crisp posters across all standard sizes."),
  S("Tickets, Vouchers & Coupons", "printing", "Numbered, perforated and secure printing."),
  // LARGE FORMAT
  S("Billboards", "large-format", "Artwork, printing and installation for outdoor giants."),
  S("Pull-Up & Roll-Up Banners", "large-format", "Portable retractable banners with carry case."),
  S("PVC & Mesh Banners", "large-format", "Durable outdoor banners with eyelets."),
  S("Vinyl Printing", "large-format", "High-resolution vinyl for any surface."),
  S("Backdrops & Step-and-Repeat", "large-format", "Branded photo and media walls."),
  S("Wall & Window Graphics", "large-format", "Frosting, wraps and full wall coverage."),
  S("Vehicle Branding", "large-format", "Cars, vans, trucks and full fleet wraps."),
  S("Outdoor Advertising", "large-format", "Site-ready outdoor campaign production."),
  // EVENTS
  S("Event Backdrops", "events", "Stage and photo backdrops built for the room."),
  S("Stage Branding & Fascia", "events", "Full stage dressing, side panels and fascia."),
  S("Teardrop & Feather Flags", "events", "Eye-catching flags with bases and poles."),
  S("Gazebos & Branded Tents", "events", "Weather-ready branded event structures."),
  S("Exhibition Stands & Booths", "events", "Pop-up stands and full exhibition builds."),
  S("Registration & Counter Branding", "events", "Branded desks, counters and podiums."),
  S("Wristbands, Badges & Lanyards", "events", "Access control and identification for events."),
  S("Floor & Venue Graphics", "events", "Directional, wayfinding and floor branding."),
  // CORPORATE
  S("Office & Reception Branding", "corporate", "Glass, wall and door branding for your space."),
  S("Corporate Signage", "corporate", "Reception, directional and office signs."),
  S("Staff ID Cards & Badges", "corporate", "Printed and encoded employee identification."),
  S("Corporate Stationery", "corporate", "Letterheads, cards, folders and envelopes."),
  S("Presentation Folders", "corporate", "Branded folders for pitches and proposals."),
  S("Branded Notebooks & Pens", "corporate", "Everyday corporate merchandise."),
  // PROMOTIONAL
  S("Branded T-Shirts & Polos", "branding", "Screen, DTF and embroidery on apparel."),
  S("Hoodies & Jackets", "branding", "Branded outerwear for teams and events."),
  S("Caps & Reflective Vests", "branding", "Headwear and hi-vis, branded to order."),
  S("Branded Mugs & Bottles", "branding", "Drinkware for gifting and promotions."),
  S("Tote & Shopping Bags", "branding", "Reusable branded bags in fabric and paper."),
  S("Umbrellas & Corporate Gifts", "branding", "Premium promotional gift sets."),
  // DESIGN
  S("Logo Design", "design", "Distinctive marks and full logo systems."),
  S("Brand Identity Design", "design", "Complete visual identity and guidelines."),
  S("Flyer & Poster Design", "design", "Attention-grabbing marketing artwork."),
  S("Brochure & Profile Design", "design", "Editorial layouts for print-ready documents."),
  S("Packaging & Label Design", "design", "Shelf-ready packaging artwork."),
  S("Print-Ready Artwork & Fixes", "design", "Corrections, file prep and press-ready setup."),
  // SIGNAGE
  S("Acrylic & 3D Signs", "signage", "Dimensional lettering and premium acrylic."),
  S("Illuminated & LED Signage", "signage", "Lightboxes and channel lettering."),
  S("Shop & Office Signs", "signage", "Storefront and interior signage."),
  S("Safety & Directional Signs", "signage", "Compliant safety and wayfinding signage."),
  S("Foam Board & Forex Displays", "signage", "Lightweight rigid display boards."),
  // PACKAGING
  S("Custom Boxes & Cartons", "packaging", "Folding cartons and product boxes."),
  S("Food & Takeaway Packaging", "packaging", "Branded food-safe packaging."),
  S("Paper & Branded Bags", "packaging", "Retail bags with rope or die-cut handles."),
  S("Product & Bottle Labels", "packaging", "Durable labels for any container."),
  S("Packaging Sleeves & Tags", "packaging", "Sleeves, hang tags and inserts."),
];

/* Which spec fields show in the quote form per category */
export const SPEC_TEMPLATES: Record<string, string[]> = {
  default: ["quantity", "sides", "material", "finish", "design"],
  "large-format": ["dimensions", "quantity", "material", "eyelets", "installation", "design"],
  events: ["eventType", "eventDate", "venue", "installation", "design"],
  signage: ["dimensions", "quantity", "material", "installation", "design"],
};

export function templateFor(category: string): string[] {
  return SPEC_TEMPLATES[category] || SPEC_TEMPLATES.default;
}

export function catName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name || id;
}
