import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_NAME = "Laayers";
export const SITE_DESCRIPTION =
  "The enterprise infrastructure layer for modern software teams. Ship faster, scale confidently.";
export const SITE_URL = "https://laayers.com";
