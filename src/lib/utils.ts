import type { SettingsType } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const defaultOllamaUrl = "http://127.0.0.1:11434";
const storage_key = 'darel_settings';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function isThisChrome() {
  return navigator.userAgent.toLowerCase().includes("chrome");
}

export function getLocalStorageSettings(): SettingsType {
  const settings = localStorage.getItem(storage_key);
  if (settings) {
    return JSON.parse(settings);
  }

  return {
    llmType: '',
    ollamaUrl: ''
  }
}

export function setLocalStorageSettings(settings: SettingsType) {
  localStorage.setItem('darel_settings', JSON.stringify(settings));
}

export function isFirstLoad() {
  const settings = localStorage.getItem(storage_key);
  return !settings;
}

export async function getOllamaModels(ollamaUrl: string) {
  try {
  const response = await fetch('api/tags', {headers: {target: `${ollamaUrl}/api/tags`}});
  const body = await response.json();
  return body.models.map((m: {name: string}) => m.name);
  } catch (err: any) {
    throw err.message;
  }
}