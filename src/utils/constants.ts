// Constantes pour l'application Sport Gym Management

export const API_ENDPOINTS = {
  MEMBERS: '/members',
  PAYMENTS: '/payments',
  ATTENDANCE: '/attendance',
  ANNOUNCEMENTS: '/announcements',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me'
  }
} as const;

export const MEMBERSHIP_TYPES = [
  { value: 'basic', label: 'Basic' },
  { value: 'premium', label: 'Premium' },
  { value: 'vip', label: 'VIP' },
  { value: 'student', label: 'Étudiant' }
] as const;

export const MEMBERSHIP_STATUS = [
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'expired', label: 'Expiré' },
  { value: 'suspended', label: 'Suspendu' }
] as const;

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Espèces' },
  { value: 'card', label: 'Carte bancaire' },
  { value: 'check', label: 'Chèque' },
  { value: 'transfer', label: 'Virement bancaire' },
  { value: 'mobile', label: 'Paiement mobile' }
] as const;

export const ANNOUNCEMENT_TYPES = [
  { value: 'general', label: 'Général' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'schedule', label: 'Horaire' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'event', label: 'Événement' }
] as const;

export const DISCIPLINES = [
  { value: 'karate', label: 'Karaté' },
  { value: 'judo', label: 'Judo' },
  { value: 'taekwondo', label: 'Taekwondo' },
  { value: 'boxing', label: 'Boxe' },
  { value: 'mma', label: 'MMA' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'pilates', label: 'Pilates' }
] as const;

export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm'
} as const;

export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 20,
  EMAIL_MAX_LENGTH: 100,
  TITLE_MAX_LENGTH: 100,
  CONTENT_MAX_LENGTH: 1000,
  AMOUNT_MIN: 0,
  AMOUNT_MAX: 10000
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language'
} as const;

export const ROUTES = {
  DASHBOARD: '/',
  MEMBERS: '/members',
  PAYMENTS: '/payments',
  ATTENDANCE: '/attendance',
  ANNOUNCEMENTS: '/announcements',
  GALLERY: '/gallery',
  ADVICE: '/advice',
  LICENSES: '/licenses',
  ADMIN: '/admin',
  LOGIN: '/login',
  REGISTER: '/register',
  PUBLIC_SEARCH: '/search'
} as const;
