// Utils de validation pour le frontend

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validation des emails
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation des numéros de téléphone (format international)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Validation des noms (lettres et espaces uniquement)
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s\u00C0-\u017F\-']+$/;
  return nameRegex.test(name) && name.trim().length >= 2;
};

// Validation des dates (format YYYY-MM-DD)
export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && !!dateString.match(/^\d{4}-\d{2}-\d{2}$/);
};

// Validation complète pour un membre
export const validateMember = (member: {
  name?: string;
  email?: string;
  phone?: string;
  discipline?: string;
}): ValidationResult => {
  const errors: string[] = [];

  // Validation du nom complet
  if (!member.name || member.name.trim().length === 0) {
    errors.push("Le nom complet est obligatoire");
  } else if (!validateName(member.name)) {
    errors.push("Le nom contient des caractères invalides");
  }

  // Validation du téléphone
  if (!member.phone || member.phone.trim().length === 0) {
    errors.push("Le téléphone est obligatoire");
  } else if (!validatePhone(member.phone)) {
    errors.push("Le format du téléphone est invalide");
  }

  // Validation de l'email
  if (member.email && member.email.trim().length > 0) {
    if (!validateEmail(member.email)) {
      errors.push("L'email n'est pas valide");
    }
  }

  // Validation de la discipline
  if (!member.discipline || member.discipline.trim().length === 0) {
    errors.push("La discipline est obligatoire");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation des paiements
export const validatePayment = (payment: {
  memberId?: string;
  amount?: number;
  paymentDate?: string;
  paymentMethod?: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!payment.memberId || payment.memberId.trim().length === 0) {
    errors.push("L'ID du membre est obligatoire");
  }

  if (!payment.amount || payment.amount <= 0) {
    errors.push("Le montant doit être supérieur à 0");
  }

  if (!payment.paymentDate || !validateDate(payment.paymentDate)) {
    errors.push("La date de paiement est invalide");
  }

  if (!payment.paymentMethod || payment.paymentMethod.trim().length === 0) {
    errors.push("Le mode de paiement est obligatoire");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation des annonces
export const validateAnnouncement = (announcement: {
  title?: string;
  content?: string;
  type?: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!announcement.title || announcement.title.trim().length === 0) {
    errors.push("Le titre est obligatoire");
  }

  if (!announcement.content || announcement.content.trim().length === 0) {
    errors.push("Le contenu est obligatoire");
  }

  if (!announcement.type || announcement.type.trim().length === 0) {
    errors.push("Le type d'annonce est obligatoire");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Fonction utilitaire pour afficher les erreurs
export const formatValidationErrors = (errors: string[]): string => {
  return errors.join(', ');
};
