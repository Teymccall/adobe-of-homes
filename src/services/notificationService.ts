import { adminService } from './adminService';

export interface NotificationCounts {
  homeOwnerApplications: number;
  artisanApplications: number;
  propertyVerifications: number;
  maintenanceRequests: number;
  payments: number;
  reports: number;
}

class NotificationService {
  private notificationCounts: NotificationCounts = {
    homeOwnerApplications: 0,
    artisanApplications: 0,
    propertyVerifications: 0,
    maintenanceRequests: 0,
    payments: 0,
    reports: 0
  };

  private listeners: Array<(counts: NotificationCounts) => void> = [];

  // Subscribe to notification updates
  subscribe(callback: (counts: NotificationCounts) => void) {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners of count changes
  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.notificationCounts));
  }

  // Update notification counts
  updateCounts(newCounts: Partial<NotificationCounts>) {
    this.notificationCounts = { ...this.notificationCounts, ...newCounts };
    this.notifyListeners();
  }

  // Get current notification counts
  getCounts(): NotificationCounts {
    return { ...this.notificationCounts };
  }

  // Get total notifications for a specific section
  getTotalForSection(section: keyof NotificationCounts): number {
    return this.notificationCounts[section] || 0;
  }

  // Get total notifications across all sections
  getTotalNotifications(): number {
    return Object.values(this.notificationCounts).reduce((total, count) => total + count, 0);
  }

  // Fetch notification counts from backend
  async fetchNotificationCounts(): Promise<void> {
    try {
      // Fetch pending applications
      const homeOwnerApps = await adminService.getHomeOwnerApplications();
      const artisanApps = await adminService.getArtisanApplications();
      
      // Count pending applications
      const pendingHomeOwnerApps = homeOwnerApps.filter(app => app.status === 'pending').length;
      const pendingArtisanApps = artisanApps.filter(app => app.status === 'pending').length;

      // Count pending property verifications
      let pendingPropertyVerifications = 0;
      try {
        const properties = await adminService.getAllProperties();
        pendingPropertyVerifications = properties.filter(prop => 
          prop.verificationStatus === 'pending' || prop.verificationStatus === 'unverified'
        ).length;
      } catch (error) {
        console.warn('Could not fetch property verification counts:', error);
      }

      // Update counts
      this.updateCounts({
        homeOwnerApplications: pendingHomeOwnerApps,
        artisanApplications: pendingArtisanApps,
        propertyVerifications: pendingPropertyVerifications,
        maintenanceRequests: 0,
        payments: 0,
        reports: 0
      });
    } catch (error) {
      console.error('Error fetching notification counts:', error);
    }
  }

  // Reset all notification counts
  resetCounts(): void {
    this.notificationCounts = {
      homeOwnerApplications: 0,
      artisanApplications: 0,
      propertyVerifications: 0,
      maintenanceRequests: 0,
      payments: 0,
      reports: 0
    };
    this.notifyListeners();
  }

  // Mark specific notifications as read
  markAsRead(section: keyof NotificationCounts): void {
    this.updateCounts({ [section]: 0 });
  }

  // Increment notification count for a section
  incrementCount(section: keyof NotificationCounts, amount: number = 1): void {
    const currentCount = this.notificationCounts[section] || 0;
    this.updateCounts({ [section]: currentCount + amount });
  }

  // Decrement notification count for a section
  decrementCount(section: keyof NotificationCounts, amount: number = 1): void {
    const currentCount = this.notificationCounts[section] || 0;
    this.updateCounts({ [section]: Math.max(0, currentCount - amount) });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
