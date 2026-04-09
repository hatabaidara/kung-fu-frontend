// Utils de formatage pour le frontend

import { DATE_FORMATS } from './constants';

// Formatage des dates
export const formatDate = (date: string | Date, format: string = DATE_FORMATS.DISPLAY): string => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Date invalide';
  }

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  switch (format) {
    case DATE_FORMATS.INPUT:
      return `${year}-${month}-${day}`;
    case DATE_FORMATS.DATETIME:
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case DATE_FORMATS.DISPLAY:
    default:
      return `${day}/${month}/${year}`;
  }
};

// Formatage des montants (monnaie)
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Formatage des numéros de téléphone
export const formatPhone = (phone: string): string => {
  // Supprime tous les caractères non numériques sauf le +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Format international si commence par +
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // Format français par défaut
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `+33${cleaned.substring(1)}`;
  }
  
  return cleaned;
};

// Formatage des noms (première lettre majuscule)
export const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Formatage des statuts
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': 'Actif',
    'inactive': 'Inactif',
    'expired': 'Expiré',
    'suspended': 'Suspendu',
    'pending': 'En attente',
    'completed': 'Terminé',
    'cancelled': 'Annulé'
  };
  
  return statusMap[status] || status;
};

// Formatage des types de membership
export const formatMembershipType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'basic': 'Basic',
    'premium': 'Premium',
    'vip': 'VIP',
    'student': 'Étudiant'
  };
  
  return typeMap[type] || type;
};

// Formatage des modes de paiement
export const formatPaymentMethod = (method: string): string => {
  const methodMap: Record<string, string> = {
    'cash': 'Espèces',
    'card': 'Carte bancaire',
    'check': 'Chèque',
    'transfer': 'Virement bancaire',
    'mobile': 'Paiement mobile'
  };
  
  return methodMap[method] || method;
};

// Formatage des disciplines
export const formatDiscipline = (discipline: string): string => {
  const disciplineMap: Record<string, string> = {
    'karate': 'Karaté',
    'judo': 'Judo',
    'taekwondo': 'Taekwondo',
    'boxing': 'Boxe',
    'mma': 'MMA',
    'fitness': 'Fitness',
    'yoga': 'Yoga',
    'pilates': 'Pilates'
  };
  
  return disciplineMap[discipline] || discipline;
};

// Formatage des durées
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

// Formatage des tailles de fichiers
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Formatage des pourcentages
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Formatage des nombres avec séparateurs
export const formatNumber = (num: number, locale: string = 'fr-FR'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

// Tronquer le texte
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + '...';
};

// Mettre en majuscules la première lettre
export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
