import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const apiService = {
  async getHoundifyAuth() {
    try {
      const response = await axios.post(`${API_BASE_URL}/houndifyAuth`);
      return response.data;
    } catch (error) {
      console.error('Authentication failed', error);
      throw error;
    }
  },

  async performTextSearch(query) {
    try {
      const response = await axios.post(`${API_BASE_URL}/textSearch`, {
        query,
      });
      return response.data;
    } catch (error) {
      console.error('Text search failed', error);
      throw error;
    }
  },

  async getMenu() {
    try {
      const response = await axios.get(`${API_BASE_URL}/menu`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch menu', error);
      throw error;
    }
  }
};