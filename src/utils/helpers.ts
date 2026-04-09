// Helpers et utilitaires divers pour le frontend

import { toast } from 'sonner';

// Gestion des erreurs avec toast
export const handleError = (error: any, defaultMessage: string = 'Une erreur est survenue') => {
  console.error('Error:', error);
  
  let message = defaultMessage;
  
  if (error?.message) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error?.error) {
    message = error.error;
  }
  
  toast.error(message);
  return message;
};

// Gestion du succès avec toast
export const handleSuccess = (message: string) => {
  toast.success(message);
  console.log('Success:', message);
};

// Gestion du chargement
export const handleLoading = (message: string = 'Chargement...') => {
  toast.loading(message);
};

// Debounce pour les recherches
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle pour les actions répétées
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Générateur d'ID unique
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Copier dans le presse-papiers
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      handleSuccess('Copié dans le presse-papiers');
      return true;
    } else {
      // Fallback pour les anciens navigateurs
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      handleSuccess('Copié dans le presse-papiers');
      return true;
    }
  } catch (error) {
    handleError(error, 'Impossible de copier dans le presse-papiers');
    return false;
  }
};

// Télécharger un fichier
export const downloadFile = (data: any, filename: string, type: string = 'application/json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  handleSuccess(`Fichier ${filename} téléchargé`);
};

// Exporter en CSV
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) {
    handleError(null, 'Aucune donnée à exporter');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  handleSuccess(`Fichier CSV ${filename} exporté`);
};

// Vérifier si un objet est vide
export const isEmpty = (obj: any): boolean => {
  if (obj == null) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Deep clone d'un objet
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
};

// Fusionner des objets (deep merge)
export const deepMerge = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key] as any;
      }
    }
  }
  
  return result;
};

// Retirer les accents
export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

// Comparaison de chaînes insensible à la casse et aux accents
export const compareStrings = (a: string, b: string): boolean => {
  return removeAccents(a.toLowerCase()) === removeAccents(b.toLowerCase());
};

// Validation des types
export const isString = (value: any): value is string => typeof value === 'string';
export const isNumber = (value: any): value is number => typeof value === 'number' && !isNaN(value);
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean';
export const isArray = (value: any): value is any[] => Array.isArray(value);
export const isObject = (value: any): value is Record<string, any> => 
  value !== null && typeof value === 'object' && !Array.isArray(value);

// Conversion des types
export const toString = (value: any): string => String(value || '');
export const toNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};
export const toBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return Boolean(value);
};

// Gestion des URLs
export const buildUrl = (base: string, params: Record<string, any>): string => {
  const url = new URL(base);
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.set(key, String(params[key]));
    }
  });
  return url.toString();
};

// Validation des URLs
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
