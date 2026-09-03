"use client";

/*
  A tiny runtime store. The server page loads content (from Sanity or the
  built-in /data fallback) and passes it to <ContentProvider>. Components read
  it via useContent(). If no provider is present, useContent() returns the
  built-in defaults, so the app is safe to render anywhere.
*/

import React, { createContext, useContext } from "react";
import { SITE } from "@/data/site";
import { SERVICES } from "@/data/services";
import { CLIENTS, WORK } from "@/data/showcase";
import { CATALOGUE } from "@/data/catalogue";

export interface SiteContent {
  site: any;
  services: any[];
  clients: any[];
  work: any[];
  catalogue: any[];
}

export const DEFAULT_CONTENT: SiteContent = {
  site: SITE,
  services: SERVICES,
  clients: CLIENTS,
  work: WORK,
  catalogue: CATALOGUE,
};

const ContentContext = createContext<SiteContent>(DEFAULT_CONTENT);

export function ContentProvider({
  content,
  children,
}: {
  content?: Partial<SiteContent>;
  children: React.ReactNode;
}) {
  const value: SiteContent = { ...DEFAULT_CONTENT, ...(content || {}) };
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): SiteContent {
  return useContext(ContentContext);
}
