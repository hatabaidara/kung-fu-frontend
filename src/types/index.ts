export type Discipline = "Boxe" | "Kung Fu" | "Boxe et Kung Fu";
export type LicenseStatus = "Actif" | "En attente" | "Expiré" | "Non disponible";
export type PaymentStatus = "Payé" | "En attente" | "En retard";

export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  discipline: string;
  age?: number;
  parent?: string;
  address?: string;
  photo?: string;
  licenseNumber?: string;
  licenseStatus: string;
  licenseExpiry?: string;
  joinDate: string;
  active: boolean;
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  type: "Inscription" | "Mensualité";
  date: string;
  status: string;
  method?: string;
  notes?: string;
}

export interface Attendance {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  present: boolean;
  discipline: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "info" | "warning" | "success" | "urgent";
  author?: string;
}

export interface Advice {
  id: string;
  title: string;
  content: string;
  category: string;
  icon?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  event: string;
  date: string;
  description?: string;
}