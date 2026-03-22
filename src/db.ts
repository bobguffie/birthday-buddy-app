import Dexie, { type Table } from 'dexie';
import { Person, ReminderSetting } from './types';

export class BirthdayBuddyDB extends Dexie {
  people!: Table<Person>;
  reminders!: Table<ReminderSetting>;

  constructor() {
    super('BirthdayBuddyDB');
    this.version(1).stores({
      people: '++id, name, birthday, category, priority, isPinned',
      reminders: '++id, personId, daysBefore'
    });
  }
}

export const db = new BirthdayBuddyDB();
