const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://kung-fu-backend.onrender.com/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(username: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Members
  async getMembers() {
    return this.request('/members');
  }

  async getMember(id: string) {
    return this.request(`/members/${id}`);
  }

  async createMember(memberData: any) {
    return this.request('/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  async updateMember(id: string, memberData: any) {
    return this.request(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  }

  async deleteMember(id: string) {
    return this.request(`/members/${id}`, {
      method: 'DELETE',
    });
  }

  async searchMembers(query: string) {
    return this.request(`/members/search/${encodeURIComponent(query)}`);
  }

  // Payments
  async getPayments() {
    return this.request('/payments');
  }

  async getPayment(id: string) {
    return this.request(`/payments/${id}`);
  }

  async getMemberPayments(memberId: string) {
    return this.request(`/payments/member/${memberId}`);
  }

  async createPayment(paymentData: any) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async updatePayment(id: string, paymentData: any) {
    return this.request(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  }

  async deletePayment(id: string) {
    return this.request(`/payments/${id}`, {
      method: 'DELETE',
    });
  }

  async getPaymentStats() {
    return this.request('/payments/stats/summary');
  }

  // Attendance
  async getAttendance() {
    return this.request('/attendance');
  }

  async getAttendanceRecord(id: string) {
    return this.request(`/attendance/${id}`);
  }

  async getMemberAttendance(memberId: string) {
    return this.request(`/attendance/member/${memberId}`);
  }

  async getAttendanceByDate(date: string) {
    return this.request(`/attendance/date/${date}`);
  }

  async checkIn(memberId: string, date?: string) {
    return this.request('/attendance/checkin', {
      method: 'POST',
      body: JSON.stringify({ member_id: memberId, date }),
    });
  }

  async checkOut(id: string) {
    return this.request(`/attendance/checkout/${id}`, {
      method: 'PUT',
    });
  }

  async createAttendanceRecord(attendanceData: any) {
    return this.request('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  async updateAttendanceRecord(id: string, attendanceData: any) {
    return this.request(`/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(attendanceData),
    });
  }

  async deleteAttendanceRecord(id: string) {
    return this.request(`/attendance/${id}`, {
      method: 'DELETE',
    });
  }

  async getAttendanceStats() {
    return this.request('/attendance/stats/summary');
  }

  // Announcements
  async getAnnouncements() {
    return this.request('/announcements');
  }

  async getAnnouncement(id: string) {
    return this.request(`/announcements/${id}`);
  }

  async createAnnouncement(announcementData: any) {
    return this.request('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  }

  async updateAnnouncement(id: string, announcementData: any) {
    return this.request(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    });
  }

  async deleteAnnouncement(id: string) {
    return this.request(`/announcements/${id}`, {
      method: 'DELETE',
    });
  }

  async getAnnouncementsByType(type: string) {
    return this.request(`/announcements/type/${type}`);
  }

  async getRecentAnnouncements() {
    return this.request('/announcements/recent/limit');
  }

  async toggleAnnouncement(id: string) {
    return this.request(`/announcements/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
