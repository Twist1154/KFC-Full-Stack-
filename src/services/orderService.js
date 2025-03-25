import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = 'http://localhost:3000/api';
let sessionId = localStorage.getItem('sessionId') || uuidv4();
localStorage.setItem('sessionId', sessionId);

export const orderService = {
  async addToCart(transcript) {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, {
        transcript,
        sessionId
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add items to cart:', error);
      throw error;
    }
  },

  async getCart() {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart/${sessionId}`);
      return response.data.cart;
    } catch (error) {
      console.error('Failed to get cart:', error);
      throw error;
    }
  },

  async removeFromCart(itemId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/cart/${sessionId}/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    }
  },

  async clearCart() {
    try {
      const response = await axios.delete(`${API_BASE_URL}/cart/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }
};