import { 
  differenceInYears, 
  isBefore, 
  setYear, 
  addYears, 
  differenceInDays, 
  startOfDay,
  format
} from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAge(birthday: Date): number {
  const today = startOfDay(new Date());
  return differenceInYears(today, birthday);
}

export function getNextBirthday(birthday: Date): Date {
  const today = startOfDay(new Date());
  let next = setYear(birthday, today.getFullYear());
  
  if (isBefore(next, today)) {
    next = addYears(next, 1);
  }
  
  return next;
}

export function getDaysUntilBirthday(birthday: Date): number {
  const today = startOfDay(new Date());
  const next = getNextBirthday(birthday);
  return differenceInDays(next, today);
}

export function formatBirthday(date: Date): string {
  return format(date, 'MMMM do');
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'Family': return 'bg-pink-500';
    case 'Friend': return 'bg-purple-500';
    case 'Work': return 'bg-blue-500';
    default: return 'bg-yellow-500';
  }
}

export function getBalloonColor(category: string): string {
  switch (category) {
    case 'Family': return '#ec4899'; // pink-500
    case 'Friend': return '#a855f7'; // purple-500
    case 'Work': return '#3b82f6'; // blue-500
    default: return '#eab308'; // yellow-500
  }
}

export function getCategoryGradient(category: string): string {
  switch (category) {
    case 'Family': return 'from-pink-400 to-rose-500';
    case 'Friend': return 'from-purple-400 to-indigo-500';
    case 'Work': return 'from-blue-400 to-cyan-500';
    default: return 'from-yellow-400 to-orange-500';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'High': return 'text-rose-600';
    case 'Medium': return 'text-amber-600';
    case 'Low': return 'text-slate-600';
    default: return 'text-slate-600';
  }
}

import { addDoc, collection } from 'firebase/firestore';
import { db as firestore } from './firebase';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

export const APP_VERSION = "1.3.0";

export async function trackClick(keyword: string, category: string) {
  try {
    await addDoc(collection(firestore, "giftClicks"), {
      keyword,
      personCategory: category,
      timestamp: Date.now(),
      appVersion: APP_VERSION,
      platform: Capacitor.getPlatform()
    });
  } catch (error) {
    console.error("Failed to track click:", error);
  }
}

export const openAmazonLink = async (url: string) => {
  try {
    console.log("Amazon URL:", url);
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  } catch (err) {
    console.error("Browser open failed:", err);
  }
};

export async function handleAmazonClick(keyword: string, category: string) {
  try {
    const AMAZON_AFFILIATE_ID = "bakingwithbob-21";
    const url = `https://www.amazon.co.uk/s?k=${encodeURIComponent(keyword)}&tag=${AMAZON_AFFILIATE_ID}`;

    // Track click (non-blocking)
    trackClick(keyword, category).catch((err) => {
      console.error("Analytics tracking failed:", err);
    });

    // Open link
    await openAmazonLink(url);
  } catch (error) {
    console.error("Amazon link error:", error);
  }
}

export async function openExternalLink(url: string, keyword?: string, category?: string) {
  if (keyword && category) {
    trackClick(keyword, category).catch(() => {});
  }
  
  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function generateGoogleUrl(keyword: string): string {
  const encoded = encodeURIComponent(keyword + ' gift ideas');
  return `https://www.google.com/search?q=${encoded}`;
}

export function getGiftSearchPhrase(person: { name: string, tags: string[], notes: string, category: string }): string {
  const keywords = [...person.tags];
  const noteWords = person.notes.split(/\s+/).filter(w => w.length > 3);
  
  // Pick a couple of interesting words from notes if tags are sparse
  if (keywords.length < 2 && noteWords.length > 0) {
    keywords.push(noteWords[0]);
  }

  const base = keywords.length > 0 ? keywords.slice(0, 2).join(" ") : person.category;
  
  // Contextual mapping
  let context = "gifts";
  const name = person.name.toLowerCase();
  
  if (person.category === 'Family') {
    if (name.includes('mum') || name.includes('mom')) context = "gifts for mum";
    else if (name.includes('dad')) context = "gifts for dad";
    else if (name.includes('sister')) context = "gifts for sister";
    else if (name.includes('brother')) context = "gifts for brother";
    else context = "gifts for family";
  } else if (person.category === 'Work') {
    context = "office gifts";
  } else if (person.category === 'Friend') {
    context = "gifts for friends";
  }

  return `${base} ${context}`.trim();
}

export const GIFT_CATEGORIES = [
  "Tech Gifts",
  "Funny Gifts",
  "Personalised Gifts",
  "Experience Gifts",
  "Eco-friendly Gifts",
  "Luxury Gifts",
  "DIY Gift Kits",
  "Nostalgic Gifts"
];

export function getRandomGiftCategories(count: number = 3): string[] {
  const shuffled = [...GIFT_CATEGORIES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
