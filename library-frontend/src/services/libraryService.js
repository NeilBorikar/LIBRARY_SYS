// Library Service - Core business logic for library operations
import apiClient from './apiService';

class LibraryService {
  constructor() {
    this.baseURL = '/library';
  }

  // Book operations
  async issueBook(bookData) {
    const response = await apiClient.post(`${this.baseURL}/issue-book`, bookData);
    return response.data;
  }

  async returnBook(bookData) {
    const response = await apiClient.post(`${this.baseURL}/return-book`, bookData);
    return response.data;
  }

  async addBook(bookData) {
    const response = await apiClient.post(`${this.baseURL}/add-book`, bookData);
    return response.data;
  }

  async getIssuedBooks() {
    const response = await apiClient.get(`${this.baseURL}/books-issued`);
    return response.data;
  }

  async getReturnedBooks() {
    const response = await apiClient.get(`${this.baseURL}/books-returned`);
    return response.data;
  }

  async getAllBooks() {
    const response = await apiClient.get(`${this.baseURL}/all-books`);
    return response.data;
  }

  async collectFine(fineData) {
    const response = await apiClient.post(`${this.baseURL}/collect-fine`, fineData);
    return response.data;
  }

  // Reminder operations
  async sendReminder(studentPrn) {
    const response = await apiClient.post(`/dashboard/send-reminder/${studentPrn}`);
    return response.data;
  }

  // Dashboard data
  async getLibraryDashboardData() {
    const response = await apiClient.get(`${this.baseURL}/dashboard`);
    return response.data;
  }
}

// Singleton instance
const libraryService = new LibraryService();
export default libraryService;
