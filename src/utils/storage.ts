import { Member, Payment, Attendance, Announcement, Advice, GalleryItem } from "../types";

const STORAGE_KEYS = {
  MEMBERS: "gym_members",
  PAYMENTS: "gym_payments",
  ATTENDANCE: "gym_attendance",
  ANNOUNCEMENTS: "gym_announcements",
  ADVICES: "gym_advices",
  GALLERY: "gym_gallery",
  SETTINGS: "gym_settings",
};

// Generic storage functions
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item, (key, value) => {
      // Convert date strings back to Date objects
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return new Date(value);
      }
      return value;
    }) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// Specific storage functions
export const storageAPI = {
  members: {
    get: (defaultValue: Member[]) => getFromStorage(STORAGE_KEYS.MEMBERS, defaultValue),
    save: (members: Member[]) => saveToStorage(STORAGE_KEYS.MEMBERS, members),
  },
  payments: {
    get: (defaultValue: Payment[]) => getFromStorage(STORAGE_KEYS.PAYMENTS, defaultValue),
    save: (payments: Payment[]) => saveToStorage(STORAGE_KEYS.PAYMENTS, payments),
  },
  attendance: {
    get: (defaultValue: Attendance[]) => getFromStorage(STORAGE_KEYS.ATTENDANCE, defaultValue),
    save: (attendance: Attendance[]) => saveToStorage(STORAGE_KEYS.ATTENDANCE, attendance),
  },
  announcements: {
    get: (defaultValue: Announcement[]) => getFromStorage(STORAGE_KEYS.ANNOUNCEMENTS, defaultValue),
    save: (announcements: Announcement[]) => saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements),
  },
  advices: {
    get: (defaultValue: Advice[]) => getFromStorage(STORAGE_KEYS.ADVICES, defaultValue),
    save: (advices: Advice[]) => saveToStorage(STORAGE_KEYS.ADVICES, advices),
  },
  gallery: {
    get: (defaultValue: GalleryItem[]) => getFromStorage(STORAGE_KEYS.GALLERY, defaultValue),
    save: (gallery: GalleryItem[]) => saveToStorage(STORAGE_KEYS.GALLERY, gallery),
  },
  settings: {
    get: (defaultValue: any) => getFromStorage(STORAGE_KEYS.SETTINGS, defaultValue),
    save: (settings: any) => saveToStorage(STORAGE_KEYS.SETTINGS, settings),
  },
};