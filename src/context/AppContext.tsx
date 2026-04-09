import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Member, Payment, Attendance, Announcement, Advice, GalleryItem } from "../types";
import { apiService } from "../services/api";
import {
  initialMembers,
  initialPayments,
  initialAttendance,
  initialAnnouncements,
  initialAdvices,
  initialGallery,
} from "../data/mockData";
import { storageAPI } from "../utils/storage";

interface AppSettings {
  registrationEnabled: boolean;
}

interface AppContextType {
  members: Member[];
  setMembers: (members: Member[]) => void;
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
  attendance: Attendance[];
  setAttendance: (attendance: Attendance[]) => void;
  announcements: Announcement[];
  setAnnouncements: (announcements: Announcement[]) => void;
  advices: Advice[];
  setAdvices: (advices: Advice[]) => void;
  gallery: GalleryItem[];
  setGallery: (gallery: GalleryItem[]) => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [members, setMembersState] = useState<Member[]>(() => storageAPI.members.get(initialMembers));
  const [payments, setPaymentsState] = useState<Payment[]>(() => storageAPI.payments.get(initialPayments));
  const [attendance, setAttendanceState] = useState<Attendance[]>(() => storageAPI.attendance.get(initialAttendance));
  const [announcements, setAnnouncementsState] = useState<Announcement[]>(() => storageAPI.announcements.get(initialAnnouncements));
  const [advices, setAdvicesState] = useState<Advice[]>(() => storageAPI.advices.get(initialAdvices));
  const [gallery, setGalleryState] = useState<GalleryItem[]>(() => storageAPI.gallery.get(initialGallery));
  const [settings, setSettingsState] = useState<AppSettings>(() => storageAPI.settings.get({ registrationEnabled: true }));

  // Load data from backend API on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load members from API
      const membersData = await apiService.getMembers() || [];        
      setMembersState(membersData);

      // Load payments from API
      const paymentsData = await apiService.getPayments() || [];      
      setPaymentsState(paymentsData);

      // Load attendance from API
      const attendanceData = await apiService.getAttendance() || [];  
      setAttendanceState(attendanceData);

      // Load announcements from API
      const announcementsData = await apiService.getAnnouncements() || [];
      setAnnouncementsState(announcementsData);

      // Load recent announcements
      const recentAdvices = await apiService.getRecentAnnouncements() || [];
      setAdvicesState(recentAdvices);

      console.log(' Data loaded from backend API successfully');      
    } catch (error) {
      console.error(' Error loading data from backend:', error);      

      // Fallback to empty arrays on error (except for members - keep localStorage)
      setMembersState(storageAPI.members.get(initialMembers));
      setPaymentsState([]);
      setAttendanceState([]);
      setAnnouncementsState([]);
      setAdvicesState([]);
    } finally {
      setLoading(false);
    }
  };

  const setMembers = (newMembers: Member[]) => {
    setMembersState(newMembers);
  };

  const setPayments = (newPayments: Payment[]) => {
    setPaymentsState(newPayments);
  };

  const setAttendance = (newAttendance: Attendance[]) => {
    setAttendanceState(newAttendance);
    storageAPI.attendance.save(newAttendance);
  };

  const setAnnouncements = (newAnnouncements: Announcement[]) => {
    setAnnouncementsState(newAnnouncements);
    storageAPI.announcements.save(newAnnouncements);
  };

  const setAdvices = (newAdvices: Advice[]) => {
    setAdvicesState(newAdvices);
    storageAPI.advices.save(newAdvices);
  };

  const setGallery = (newGallery: GalleryItem[]) => {
    setGalleryState(newGallery);
    storageAPI.gallery.save(newGallery);
  };

  const setSettings = (newSettings: AppSettings) => {
    setSettingsState(newSettings);
    storageAPI.settings.save(newSettings);
  };

  return (
    <AppContext.Provider
      value={{
        members,
        setMembers,
        payments,
        setPayments,
        attendance,
        setAttendance,
        announcements,
        setAnnouncements,
        advices,
        setAdvices,
        gallery,
        setGallery,
        settings,
        setSettings,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};