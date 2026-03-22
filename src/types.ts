export type Category = 'Family' | 'Friend' | 'Work' | 'Other';
export type Priority = 'High' | 'Medium' | 'Low';

export interface GiftHistoryItem {
  year: number;
  gift: string;
}

export interface Person {
  id?: number;
  name: string;
  birthday: Date;
  category: Category;
  priority: Priority;
  notes: string;
  tags: string[];
  lastGift?: string;
  giftHistory?: GiftHistoryItem[];
  budget?: number;
  photo?: string; // Base64 string
  isPinned?: boolean;
  createdAt: Date;
}

export interface ReminderSetting {
  id?: number;
  personId: number;
  daysBefore: number;
  enabled: boolean;
}
