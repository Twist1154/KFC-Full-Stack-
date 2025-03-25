# 🍗 KFC Drive-Through Voice Ordering App  

This application allows customers to place orders at a KFC drive-through using **voice commands**. It provides a seamless ordering experience through a **React + Vite** frontend, **Express.js** backend, and **Houndify** for voice recognition.  

---

## 🚀 Key Technologies  

### **Frontend (React + Vite)**  
✅ **Material-UI** for a sleek and responsive interface  
✅ **Grid layout** to display menu items  
✅ **Floating microphone button** for hands-free ordering  
✅ **Order summary and cart management**  

### **Voice Recognition (Houndify)**  
The `HoundifyService` class powers voice recognition:  
🔹 Initializes the **Houndify client**  
🔹 Captures audio from the user’s microphone  
🔹 Converts **speech to text**  
🔹 Provides **real-time transcription updates**  
🔹 Delivers **text-to-speech feedback**  

### **Backend (Express + PostgreSQL)**  
The server handles:  
🔹 **Menu management** – Stores and retrieves menu items  
🔹 **Cart management** – Tracks session-based shopping carts  
🔹 **Order processing** – Creates and tracks orders  
🔹 **Database interactions** – Stores orders and menu data  

---

## 🎤 How It Works  

### 🛒 **Voice Ordering Process**  
1️⃣ User clicks the **microphone button**  
2️⃣ Speaks their order (e.g., *"I want a 21-piece bucket"*)  
3️⃣ System recognizes the items and **adds them to the cart**  
4️⃣ Provides **voice feedback** to confirm the order  

### 🛍️ **Cart Management**  
✔️ Tracks carts using **session IDs (UUID)**  
✔️ Supports **adding/removing items**  
✔️ **Calculates total prices** dynamically  
✔️ Persists cart data **between page refreshes**  

### 🏷️ **Order Processing**  
✔️ **Validates orders** before checkout  
✔️ Stores order details in **PostgreSQL**  
✔️ Handles the **checkout process**  
✔️ Maintains **order history** for tracking  

---

## 🔄 Data Flow  

```plaintext
User Voice Command
  ↓
Houndify Service (Speech-to-Text)
  ↓
React Frontend
  ↓
API Service / Order Service
  ↓
Express Backend
  ↓
PostgreSQL Database
```

---

## 🎯 Summary  
This application delivers a **modern, hands-free** ordering experience, replicating a real KFC drive-through but via a **web interface**. 🚗🎙️  
