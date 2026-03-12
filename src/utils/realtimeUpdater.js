// Real-time dashboard update utility
import dashboardService from '../services/dashboardService';

class RealtimeUpdater {
  constructor() {
    this.listeners = new Map();
    this.lastUpdate = null;
  }

  // Subscribe to real-time updates
  subscribe(role, callback) {
    if (!this.listeners.has(role)) {
      this.listeners.set(role, []);
    }
    this.listeners.get(role).push(callback);
  }

  // Unsubscribe from updates
  unsubscribe(role, callback) {
    if (this.listeners.has(role)) {
      const callbacks = this.listeners.get(role);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Trigger update after book transaction
  async triggerUpdate(transactionType, details) {
    console.log(`🔄 Real-time update triggered: ${transactionType}`, details);
    
    try {
      // Refresh dashboard data
      await dashboardService.triggerRefresh();
      
      // Notify all listeners
      this.listeners.forEach((callbacks, role) => {
        callbacks.forEach(callback => {
          try {
            callback({
              type: transactionType,
              details,
              timestamp: new Date(),
              role
            });
          } catch (error) {
            console.error(`Error in callback for ${role}:`, error);
          }
        });
      });
      
      // Update last update timestamp
      this.lastUpdate = new Date();
      
      // Show success notification
      this.showNotification(
        'Dashboard Updated',
        `${transactionType === 'issue' ? 'Book Issued' : 'Book Returned'} successfully!`,
        'success'
      );
      
    } catch (error) {
      console.error('Error triggering real-time update:', error);
      this.showNotification(
        'Update Failed',
        'Failed to update dashboard data',
        'error'
      );
    }
  }

  // Simulate book issue
  async simulateBookIssue(bookTitle, studentName, department) {
    return await this.triggerUpdate('issue', {
      bookTitle,
      studentName,
      department,
      action: 'decrementAvailable',
      action: 'incrementIssued'
    });
  }

  // Simulate book return
  async simulateBookReturn(bookTitle, studentName, department) {
    return await this.triggerUpdate('return', {
      bookTitle,
      studentName,
      department,
      action: 'incrementAvailable',
      action: 'decrementIssued'
    });
  }

  // Simulate fine payment
  async simulateFinePayment(studentName, amount) {
    return await this.triggerUpdate('fine_payment', {
      studentName,
      amount,
      action: 'decrementPendingFines'
    });
  }

  // Show notification (simple implementation)
  showNotification(title, message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
    
    // Set color based on type
    const colors = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
      warning: 'bg-yellow-500 text-white'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    notification.innerHTML = `
      <div class="font-bold">${title}</div>
      <div class="text-sm mt-1">${message}</div>
      <div class="text-xs mt-2 opacity-75">${new Date().toLocaleTimeString()}</div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
      notification.classList.add('translate-x-0');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Get last update time
  getLastUpdate() {
    return this.lastUpdate;
  }
}

// Create singleton instance
const realtimeUpdater = new RealtimeUpdater();

export default realtimeUpdater;
