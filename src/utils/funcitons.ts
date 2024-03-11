import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const BASE_URL = import.meta.env.VITE_BASE_URL as string
export const BASE_URL2 = import.meta.env.VITE_BASE_URL.replace("v1","v2") as string